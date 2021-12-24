const fs = require('fs');
const http = require('http');
const Map = require("./public/js/map");
const map = new Map();
const os = require("os");
const stringify = require("json-stringify-pretty-compact");
const WebSocketServer = require("websocket").server;
const [Creature,Item] = require("./js/server_components");
const monstersTypes = require("./js/monstersTypes");
const dbConnect = require("./js/dbconnect");
const dbc = new dbConnect();
const inGameMonsters = require("./json/monstersList").data;
const game = require("./public/js/gameDetails");
const public = require("./js/public");
const itemsList = require("./json/itemsList").list;
const { db } = require('./public/js/gameDetails');
let servRequest = false;
// filter data on websocket send
const disallowKeys = [
  "startPosition",
  "email",
  "password",
  "lastDeaths"
];
const cm = { // creatures managment
  allMonsters: [],
  monstersInArea: [],
  loadMonsters(){
    for(const m of inGameMonsters){
      const monster = new Creature(m.name,this.allMonsters.length,"monster");
      for(const k of Object.keys(m)){
        monster[k] = m[k];
      }
      monster.startPosition = m.position;
      monster.type = "monster";
      for(const sm of monstersTypes){ // single monster
        if(sm.name == m.name){
          for(const md of Object.keys(sm)){ // monster details
            monster[md] = sm[md];
          }
        }
      }
      monster.maxHealth = monster.health;
      this.allMonsters.push(monster);
    }
  },
  monstersUpdate(player){
     //  update only monsters in area
    this.monstersInArea = [];
    for(const c of this.allMonsters){
      if(Math.abs( c.position[0] - player.position[0] ) < 7
      && Math.abs( c.position[1] - player.position[1] ) < 7){
        this.monstersInArea.push(c);
      }
    }
    for(const c of this.monstersInArea){
      // 0 because of monsters don't upgrades skills
      c.update(param,0,this.monstersInArea.concat(this.players.list),im);
    }
  },
  init(){
    this.loadMonsters();
  },
  update(param,callback){
    this.players.update(param,(player)=>{
      this.monstersUpdate(player);
      game.player = player.id;
      if(typeof player.text == "undefined"){delete player.text;}
      const filteredCreatures = [];
      for(const creature of this.players.list.concat(this.monstersInArea)){
        const filteredCreature = {};
        for(const key of Object.keys(creature)){
          if(!disallowKeys.includes(key)){
            filteredCreature[key] = creature[key];
          }
        }
        filteredCreatures.push(filteredCreature);
      }
      const newData = {
        game: game,
        creatures: filteredCreatures
      }
      callback(newData,player);
      // retrive died player
      if(typeof game.dead != "undefined"){
        delete game.dead;
        player.position = player.startPosition;
        player.health = player.totalHealth;
        player.mana = player.totalMana;
        player.cyle = 0;
        player.direction = 1;
        this.players.kick(player);   
      }
      player.text = "";
    })
  },
  players: {
    init(db){
      // REFRESH PLAYER SKILLS [ONCE A SERV LOAD])
      const skipKeys = [
        "healthValue",
        "text",
        "game",
        "shotTarget",
        "bulletOnTarget",
        "cyle",
      ];
      const deleteKeys = ['healing'];
      db.loadAll((res)=>{
        for(const plr of res){
          // make instance of player
          const player = new Creature(plr.name,0,"player");
          // rewrite
          for(const key of Object.keys(plr)){
            // console.log(key)
            // if(deleteKeys.includes(key)){console.log(key)}
            if(skipKeys.includes(key)){continue;}
            if(plr[key].constructor === Object){
            // if it's object
              player[key] = {};
              for(const keyIn of Object.keys(plr[key])){
                if(deleteKeys.includes(keyIn)){
                  console.error("deleting "+keyIn+" from "+plr.name+" "+key)
                }else{
                  player[key][keyIn] = plr[key][keyIn];
                }
              }
            }else if(plr[key].constructor === Array){
            // if it's array
              player[key] = [];
              for(const keyIn of Object.keys(plr[key])){
                player[key][keyIn] = plr[key][keyIn];
              }
            }else{
              player[key] = plr[key];
            }
          }
          // update player
          player.update({name:player.name,type: 'initUpdate'},db,[],{itemsInArea:[]});
          // update player skills
          player.skills.level = -1;
          // player is update in db there:
          player.updateSkills(db);
        }
      });
    },
    list:[],
    inArea:[],
    inLoading:[],
    update(param,callback){
      // console.log(this.list)
      // TO DO MAKE inArea PLAYERS LIST!
      // check if player is on the list (in the game).
      let isPlayer = false;
      for(const p of this.list){
        // update player is playing
        if(p.name == param.name){
          isPlayer = p;
          isPlayer.update(param,dbc[game.db],cm.monstersInArea.concat(this.list),im);
          callback(isPlayer);
          break;
        }
      }
      // push player to online list
      if(isPlayer == false && !this.inLoading.includes(param.name)){
        this.inLoading.push(param.name);
        //  make new unique id
        const ids = [];for(const creat of this.list.concat(cm.allMonsters)){ids.push(creat.id);}
        let newID = 1; while(ids.includes(newID)){newID++;}
        // get info from srv;
        const newPlayer = new Creature(param.name,newID-1,"player");
        // save player login token
        if(servRequest && typeof servRequest.headers != 'undefined' && typeof servRequest.headers.cookie != 'undefined' ){
          for(const cookie of servRequest.headers.cookie.split("; ")){
            const [key,value] = cookie.split("=");
            if(key == "token"){newPlayer.token = value;}
          } 
        }
        dbc[game.db].load(newPlayer,(res)=>{
          if(res){
            // merge it with newPlayer
            const defaultPosition = newPlayer.position;
            for(const k of Object.keys(res)){
              if(['token'].includes(k)){continue;}
              newPlayer[k] = res[k];
            }
            if(newPlayer.lastFrame < game.lastUpdate){
              newPlayer.position = defaultPosition;
            }
          }
          newPlayer.type = "player";
          this.inLoading.splice(this.inLoading.indexOf(param.name),1);     
          this.list.push(newPlayer);
          // update player loading info (token etc)
          dbc[game.db].update(newPlayer);
          callback(newPlayer);
        }); 
      }
      // kick off offline.
      const kickTime = isPlayer.focus?1000:20000;
      setTimeout(() => {
        if(typeof isPlayer == "object" 
          && new Date().getTime() - isPlayer.lastFrame > kickTime
          && this.list.includes(isPlayer)){
            cm.players.kick(isPlayer)
        }
      }, 1000);
    },
    kick(player){
      let isThisPlayerOlnine = false;
      for(const singlePlayer of this.list){
        if(singlePlayer.name == player.name){
          isThisPlayerOlnine = true;
          break;
        }
      }
      if(isThisPlayerOlnine){
        this.list.splice(this.list.indexOf(player),1);
        dbc[game.db].update(player);
        console.log(player.name+" KICKED")
      }
    }
  }
}
const im = { // items management
  allItems:[],
  itemsInArea:[],
  init(){
    // get static items
    for(const item of itemsList){
        this.allItems.push(new Item(item));
    }
  },
  update(newData,player,callback){
    this.itemsInArea = [];
    for(const item of this.allItems){
      if(Math.abs(player.position[0] - item.position[0]) <= 6
        && Math.abs(player.position[1] - item.position[1])<= 6 
      ){
        this.itemsInArea.push(new Item(item));
      }
    }
    newData.items = this.itemsInArea;
    callback(newData);
  }
}
let param;cm.init();im.init();
dbc.init(()=>{
  cm.players.init(dbc[game.db]);
  const server = http.createServer((req,res)=>{
    servRequest = req;
    public(req,res,cm.players.list)
  }).listen(process.env.PORT || 80);
  const date = new Date();
  game.startServerTime = date.getTime();
  console.log("SERWER IS RUNNING");
  // WEBSOCKET
  new WebSocketServer({httpServer : server})
  .on('request', (req)=>{
    const connection = req.accept('echo-protocol', req.origin);
    connection.on('message', (data) => {
      param = JSON.parse(data.utf8Data);
      // In game actions
      if(Object.keys(param).includes("name")){
        game.time = new Date();
        game.cpu = Math.round((100*(os.totalmem() - os.freemem()))/os.totalmem)+"%";
        cm.update(param,(newData,player)=>{
          im.update(newData,player,(newData)=>{
            connection.sendUTF(stringify(newData,null,2));
          })
        })
      }
      // Getting data
      if(Object.keys(param).includes("get")){
        const mapPatch = map.path;
        if(param.get == "map"){
          const mapRead = fs.readFileSync(mapPatch,{encoding:'utf8'});
          const mapArr = JSON.parse(mapRead);
          connection.sendUTF(stringify(mapArr,null,2));
        }
        // Get onlinelist
        if(param.get == "onlineList"){
          const onlineList = [];
          for(const p of cm.players.list){
            onlineList.push({"name":p.name,"skills":{"level":p.skills.level}});
          }
          connection.sendUTF(stringify(onlineList,null,2));
        }
        // PUSH MAP
        if(param.get == "pushmap"){
          connection.sendUTF(map.saveToFileMap(mapPatch,param));
        }
      }       
    })
  })
})


// SAVE PLAYERS BEFORE SERVER CRASH
const shutdown = (signal) => {
  return (err) => {
    if (err) console.error(err.stack || err);
    for(const player of cm.players.list){
      player.console = "Server will restart in few seconds.";
      dbc[game.db].update(player);
    }
    console.log('PLAYERS SAVED AFTER '+signal);
  };
}
process.on('SIGTERM', shutdown('SIGTERM')).on('SIGINT', shutdown('SIGINT')).on('uncaughtException', shutdown('uncaughtException')); 


// CATCH ALL CONSOLE LOGS AND ERRORS
// const log = console.log;
// const err = console.error;
// const extendConsole = (val) => {
//   const date = new Date();
//   const time = date.getHours()+":"+date.getMinutes(); 
//   args = [time,val];
//   const content = JSON.parse(fs.readFileSync('./public/logs.json','utf-8'));
//   content.push({"log" : time+": "+val});
//   fs.writeFileSync('./public/logs.json',stringify(content));
// }
// console.log = (val) => {     
//   extendConsole(val);
//   log.apply(console, args);
// }
// console.error = (val) => {     
//   extendConsole(val);
//   err.apply(console, args);
// }



// HEROKU IDLING
// Tested and working on my own Heroku app using Node.js 0.10.x on 6/28/2013
// var http = require('http'); //importing http
// function startKeepAlive() {
//     setInterval(function() {
//         var options = {
//             host: 'your_app_name.herokuapp.com',
//             port: 80,
//             path: '/'
//         };
//         http.get(options, function(res) {
//             res.on('data', function(chunk) {
//                 try {
//                     // optional logging... disable after it's working
//                     console.log("HEROKU RESPONSE: " + chunk);
//                 } catch (err) {
//                     console.log(err.message);
//                 }
//             });
//         }).on('error', function(err) {
//             console.log("Error: " + err.message);
//         });
//     }, 20 * 60 * 1000); // load every 20 minutes
// }
// startKeepAlive();