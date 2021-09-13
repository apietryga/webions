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
const inGameMonsters = require("./json/inGameMonsters.js").data;
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

const cm = { // creatures managment
  monsters: [],
  loadMonsters(){
    for(const m of inGameMonsters){
      const monster = new Creature(m.name,this.monsters.length);
      monster.startPosition = m.position;
      monster.position = m.position;
      monster.type = "monster";
      for(const sm of monstersList){ // single monster
        if(sm.name == m.name){
          for(const md of Object.keys(sm)){ // monster details
            monster[md] = sm[md];
          }
        }
      }
      monster.maxHealth = monster.health;
      this.monsters.push(monster);
    }
  },
  monstersUpdate(player){
     //  update only monsters in area
    for(const c of this.monsters){
      if(Math.abs( c.position[0] - player.position[0] ) < 7
      && Math.abs( c.position[1] - player.position[1] ) < 7){
        c.update(param,game,map,func,this.monsters.concat(this.players.list));
      }
    }

  },
  init(){
    this.loadMonsters();
  },
  update(param,callback){
    this.players.update(param,(player)=>{
      this.monstersUpdate(player);
      game.player = player.id;
      const newData = {
        game: game,
        creatures: this.players.list.concat(this.monsters)
      }
      callback(newData);
    })
  },
  players: {
    list:[],
    update(param,callback){
      // check if player is on the list.
      let isPlayer = false;
      // update player is exists
      for(const p of this.list){
        if(p.name == param.name){
          isPlayer = p;
          isPlayer.lastFrame = game.time.getTime();
          isPlayer.update(param,game,map,func,cm.monsters.concat(this.list));
          callback(isPlayer);
          break;
        }
      }

      // create new player
      if(isPlayer == false){
        //  make new unique id
        const ids = [];
        for(let plr of this.list.concat(cm.monsters)){ids.push(plr.id);}          
        let newID = 1;
        while(ids.includes(newID)){newID++;}
        
        // get info from srv;
        const newPlayer = new Creature(param.name,newID-1);
        dbc[game.db].load(newPlayer,(res)=>{
          if(res){
            // merge it with newPlayer
            for(const k of Object.keys(res)){
              newPlayer[k] = res[k];
            }
          }else{
            // create record
            dbc[game.db].update(newPlayer);
          }
          newPlayer.type = "player";
          newPlayer.lastFrame = game.time.getTime();        
          this.list.push(newPlayer);
          callback(newPlayer);
        }); 
      }
      
      // kick off offline.
      setTimeout(() => {
        if(typeof isPlayer == "object" 
          && new Date().getTime() - isPlayer.lastFrame > 1000
          && this.list.includes(isPlayer)){
            dbc[game.db].update(isPlayer);
            this.list.splice(this.list.indexOf(isPlayer),1);
        }
      }, 1500);
    }
  }
}

let param;
cm.init();
dbc.init(()=>{
  console.log("Database set: "+game.db);
  const server = http.createServer(handler).listen(process.env.PORT || 80);
  console.log("serwer is running on: http://webions");
  // WEBSOCKET
  const wsServer = new WebSocketServer({httpServer : server})
  .on('request', (req)=>{
    const connection = req.accept('echo-protocol', req.origin);
    // let newData = "ERROR 1";
    connection.on('message', (data) => {
      param = JSON.parse(data.utf8Data);
      // In game actions
      if(Object.keys(param).includes("name")){
        game.time = new Date();
        cm.update(param,(newData)=>{
          connection.sendUTF(stringify(newData,null,2));
        })

      }
      // Getting data
      if(Object.keys(param).includes("get")){
        let result = {};
        // Get playersList
        if(param.get == "playersList"){
          dbc[game.db].loadAll((result)=>{
            connection.sendUTF(stringify(result,null,2));
          })
        }
        // Get gameMap
        if(param.get == "map"){
          result = map;
          connection.sendUTF(stringify(result,null,2));
        }
        // Get onlinelist
        if(param.get == "onlineList"){
          const onlineList = [];
          for(const p of cm.players.list){
            onlineList.push({"name":p.name,"skills":{"level":p.skills.level}});
          }
          connection.sendUTF(stringify(onlineList,null,2));
        }

      }       
    })
  })
})