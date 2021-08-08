const fs = require('fs');
// const https = require('https');
const http = require('http');
const {URL} = require('url');
const map = require("./json/map.json");
const func = require("./js/functions");
const static = require('node-static');
const file = new(static.Server)(__dirname);
const Creature = require("./js/server_components.js");
// const ipv4 = '0.0.0.0';
// const options = {
//   key: fs.readFileSync('ssl_/cert/key.pem'),
//   cert: fs.readFileSync('ssl_/cert/cert.pem')
// };

const game = {
  time : new Date(),
  fps: 10,
  items:[]
}
const creatures = [];
const monstersList = [
  {name:"Mage",
    id:3,
    // position:[0,7,1], // left tower
    position:[0,3,0],
    sprite:"mmage",
    type:"monster",
    health:1000,
    // maxHealth
    maxHealth:1000,
    speed:3,
    skills:{
      fist:10,
      exp:1
    }
  },
  {name:"Dragon",
    id:1,
    position:[0,7,1], // left tower
    // position:[0,3,0],
    sprite:"dragon",
    type:"monster",
    health:1000,
    // maxHealth
    maxHealth:1000,
    speed:2,
    skills:{
      fist:10,
      exp:10
    }
  },
  {name:"Cyclops",
    id:2,
    position:[15,7,1], // right tower
    // position:[4,3,0],
    sprite:"cyclops",
    type:"monster",
    health:1500,
    maxHealth:1500,
    speed:2.5,
    skills:{
      fist:10,
      exp:15
    }
  }
  // ,
  // {name:"Hellknight",
  //   id:0,
  //   // position:[0,7,1], // left tower
  //   position:[2,3,0],
  //   sprite:"hellknight",
  //   type:"monster",
  //   health:1000,
  //   // maxHealth
  //   maxHealth:1000,
  //   speed:4,
  //   skills:{
  //     fist:100,
  //     exp:150
  //   }
  // }
]
function handler(req, res) {
  game.time = new Date();
  const {url} = req;
  const href = "https://"+req.rawHeaders[1];
  const myURL = new URL(href+url);
  const search = myURL.search;
  const param = Object.fromEntries(new URLSearchParams(search));
  // player update
  if(Object.keys(param).includes("name")){
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
      player = new Creature(param.name,creatures.length);
      creatures.push(player);
    }
    player.text = "";
    player.type = "player";
    player.update(param,game,map,func,creatures);
    // output
    const newData = {
      game: game,
      creatures: creatures
    }
    res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
    res.write(JSON.stringify(newData,null,2),"utf-8")
    res.end()
  }else{
    // serve static files
    file.serve(req, res);
  }
}

// https.createServer(options,handler).listen(443,ipv4);
http.createServer(handler).listen(80);
console.log("serwer is running on: http://webions");
