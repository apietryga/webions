const fs = require('fs');
const https = require('https');
const {URL} = require('url');
const map = require("./json/map.json");
const func = require("./js/functions");
const ipv4 = '0.0.0.0';
const static = require('node-static');
const file = new(static.Server)(__dirname);
const options = {
  key: fs.readFileSync('ssl_/cert/key.pem'),
  cert: fs.readFileSync('ssl_/cert/cert.pem')
};
const game = {
  time : new Date(),
  fps: 10
}
class Creature {
  constructor(nickName){
    this.name = nickName;
    this.position = [2,3,0];
    this.walk = 0;
    this.speed = 2; // grids per second
    this.sprite = "citizen";
  }
  update(param = {name:""}){
    // if(this.walk <= game.time.getTime()){this.walk = 0;}
    if(this.controls != "" && this.walk <= game.time.getTime()){
      let phantomPos;
      if(this.type == "player"){
        // get clicked key
        const key = param.controls.split(",")[0];
        // set probably future position
        phantomPos = [this.position[0], this.position[1], this.position[2]];
        switch (key) {
          case '39':  // right key
            phantomPos[0]++;
            break;
          case '37':  // left key
            phantomPos[0]--;
            break;
          case '38':  // up key
            phantomPos[1]--;
            break;
          case '40':  // down key
            phantomPos[1]++;
            break;
        }
      }else{
        phantomPos = this.position;
        if(phantomPos[0] < 15){
          phantomPos[0]++;
        }else{
          phantomPos[0]--;
        }
      }
      // check if position is availble
      let isFloor = false;
      // check grids
      for (let grid of map) {
        if (func.compareTables([grid[1],grid[2],grid[3]], phantomPos)) {
          if (typeof grid[4] !== "undefined" && grid[4] == "stairs") {
            // STAIRS / TELEPORTS ETC.
            phantomPos = grid[5];
            // console.log(grid[5]);
          }else{
            // console.log("IDEM");
          }          
          isFloor = true;
          break;
        }        
      }
      // check monsters and players
      for(const c of creatures){
        if (func.compareTables(c.position, phantomPos) && c.name != param.name) {
          isFloor = false;
        }        
      }
      // set new position or display error
      if(isFloor){
        this.position = phantomPos;
        const key = param.controls.split(",")[0];
        if(this.type == "player" && ['37','38','39','40'].includes(key)){
          // set exhoust
          this.walk = game.time.getTime() + Math.round(1000/this.speed);
        }
      }else{
        this.text = "NO FUCKING WAY.";
      }
    }
  }
}
const creatures = [];
const monstersList = [
  {id:1,name:"Dragon",position:[1,7,1],sprite:"dragon",type:"monster"},
  {id:2,name:"Cyclops",position:[15,7,1],sprite:"cyclops",type:"monster"}
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
        const monster = new Creature(m.name);
        monster.type = "monster";
        for(const key of Object.keys(m)){
          monster[key] = m[key];
        }
        creatures.push(monster);
      }
    }
    for(const c of creatures){
      // console.log(c.type == "monster");
      if(c.type == "monster"){
        c.update();
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
      player = new Creature(param.name);
      creatures.push(player);
    }
    player.text = "";
    player.type = "player";
    player.update(param);
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

https.createServer(options,handler).listen(443,ipv4);
console.log("serwer is running on: https://webions");
