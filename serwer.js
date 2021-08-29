const fs = require('fs');
const http = require('http');
const {URL} = require('url');
const map = require("./json/map.json");
const func = require("./js/functions");
const static = require('node-static');
const file = new(static.Server)("www");
const file2 = new(static.Server)(__dirname);
const stringify = require("json-stringify-pretty-compact");
const WebSocketServer = require("websocket").server;
const Creature = require("./js/server_components");
const monstersList = require("./js/monstersList");
const game = {
  time : new Date(),
  fps: 10,
  items:[]
}
const creatures = [];
function handler(req, res) {
  const {url} = req;
  const href = "http://"+req.rawHeaders[1];
  const myURL = new URL(href+url);
  const search = myURL.search;
  const param = Object.fromEntries(new URLSearchParams(search));
  if(Object.keys(param).includes("mapedit")){
  // map editor
    const mapRead = fs.readFileSync("json/map.json",{encoding:'utf8'});
    const mapArr = JSON.parse(mapRead);
    const paramArr = param.position.split(",");
    const paramEl = param.element.split(",");
    mapArr.push([paramEl[1]*1,paramArr[0]*1,paramArr[1]*1,paramArr[2]*1]);
    const mapString = stringify(mapArr,null,2);
    fs.writeFileSync("json/map.json",mapString);
    let output = mapString;
    res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
    res.write(stringify(output,null,2),"utf-8")
    res.end()

  }else{
    // static www files: 
    const www = [
      "/",
      "/index.html",
      "/howtoplay.html",
      "/players.html",
      "/style/page.css"
    ];
    if(www.includes(myURL.pathname)){
      // serve www folder
      file.serve(req, res);
    }else{
      // serve main folder
      file2.serve(req,res);
    }
  }
}
const server = http.createServer(handler).listen(process.env.PORT || 80);
console.log("serwer is running on: http://webions");

// WEBSOCKET
const wsServer = new WebSocketServer({httpServer : server})
.on('request', (req)=>{
  const connection = req.accept('echo-protocol', req.origin);
  let newData = "ERROR 1";
  // console.log(req)
  connection.on('message', (data) => {
    game.time = new Date();
    const param = JSON.parse(data.utf8Data);
    // if(Object.keys(param).includes("name")){
    if(2 == 2){
      // manage monsters
      for(const m of monstersList){
        m.isset = false;
        for(const c of creatures){
          if(c.name == m.name && c.type == "monster"){
            // update monster
            m.isset = true;
          }
        }
        if(!m.isset){
          const monster = new Creature(m.name,creatures.length);
          monster.type = "monster";
          for(const key of Object.keys(m)){
            monster[key] = m[key];
          }
          creatures.push(monster);
        }
      }
      for(const c of creatures){
        if(c.type == "monster"){
          c.update(param,game,map,func,creatures);
        }
      }
      // manage player:
      let player = {};
      let isPlayerSet = false;
      for(const c of creatures){
        if(c.name == param.name){
          isPlayerSet = true;
          player = c;
        }
      }
      if(!isPlayerSet){
        // console.log(param)
        player = new Creature(param.name,creatures.length);
        creatures.push(player);
      }
      player.text = "";
      player.type = "player";
      player.update(param,game,map,func,creatures);
      // output
      newData = {
        game: game,
        creatures: creatures
      }
      // res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
      // res.write(stringify(newData,null,2),"utf-8")
      // res.end()
    }
    connection.sendUTF(stringify(newData,null,2));
  })
})