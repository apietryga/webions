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
const makewww = require("./www/makewww");
const dbConnect = require("./js/dbconnect");
const dbc = new dbConnect();
// set game details
const game = require("./js/gameDetails")
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
    const type = param.element.split(",")[0];
    const gridToPush = [
      paramEl[1]*1,
      paramArr[0]*1,
      paramArr[1]*1,
      paramArr[2]*1
    ]
    if(type != "floors"){
      gridToPush.push(type);
    }
    if(type == "stairs"){
      gridToPush.push([0,1,2]);
    }


    mapArr.push(gridToPush);
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
      "/style/page.css",
      "/makewww",
      "/wwwscripts.js",
      "/img/whitetarget.gif",
      "/img/redtarget.gif",
      "/img/dist.gif",
      "/img/healing.gif",
    ];
    if(www.includes(myURL.pathname)){
      if(myURL.pathname == "/makewww"){
        // make www htmls
        makewww(()=>{
          // serve www folder
          file.serve(req, res);
        });
      }else{
        file.serve(req, res);
      }      
    }else{
      // serve main folder
      file2.serve(req,res);
    }
  }
}
const server = http.createServer(handler).listen(process.env.PORT || 80);
console.log("serwer is running on: http://webions");

// set arr for all creatures
const creatures = [];
// add all monsters to creatures arr
for(const m of monstersList){
  const monster = new Creature(m.name,creatures.length);
  monster.type = "monster";
  for(const key of Object.keys(m)){
    monster[key] = m[key];
  }
  creatures.push(monster);
}

// WEBSOCKET
const wsServer = new WebSocketServer({httpServer : server})
.on('request', (req)=>{
  const connection = req.accept('echo-protocol', req.origin);
  let newData = "ERROR 1";
  connection.on('message', (data) => {
    const param = JSON.parse(data.utf8Data);
    // In game actions
    if(Object.keys(param).includes("name")){
      game.time = new Date();
      // update monsters
      for(const c of creatures){
        if(c.type == "monster"){
          c.update(param,game,map,func,creatures);
        }
      }
      // manage player:
      let player;
      let isPlayerSet = false;
      for(const c of creatures){
        // log out (if not download info in 1s)
        if(typeof c.lastFrame != "undefined" 
        && c.type == "player"
        && game.time.getTime() - c.lastFrame > 1000){
          dbc.update(c);
          creatures.splice(creatures.indexOf(c),1);
          continue;
        }
        
        // update player
        if(c.name == param.name){
          isPlayerSet = true;
          player = c;
          player.lastFrame = game.time.getTime();
        }
      }
      // make online list 
      const onlinePlayers = [];
      for(const c of creatures){
        if(c.type == "player"){
          onlinePlayers.push(c.name);
        }
      }
      
      // first login - creating player or get him from base
      // make sure, that player is not exist
      if(!isPlayerSet && !onlinePlayers.includes(param.name)){
        player = new Creature(param.name,creatures.length);
        player.lastFrame = game.time;
        dbc.load(player,(r)=>{
          player = r;
          creatures.push(player);
          newData = {
            game: game,
            creatures: creatures
          }
          connection.sendUTF(stringify(newData,null,2));
        })
      }
      if(typeof player != "undefined"){
        player.text = "";
        player.type = "player";
        player.update(param,game,map,func,creatures);
      }
      // output
      newData = {
        game: game,
        creatures: creatures
      }
      connection.sendUTF(stringify(newData,null,2));
    }
    // Getting data
    if(Object.keys(param).includes("get")){
      let result = {};
      // Get playersList
      if(param.get == "playersList"){
        // result = dbc.loadContent();
        dbc.loadContent((result) => {
          connection.sendUTF(stringify(result,null,2));
        })
      }
      // Get gameMap
      if(param.get == "map"){
        result = map;
      }
      connection.sendUTF(stringify(result,null,2));
    }    
  })
})