const fs = require('fs');
const GameMap = require("../public/js/map");
const map = new GameMap();
const os = require("os");
const stringify = require("json-stringify-pretty-compact");
const WebSocketServer = require("websocket").server;
const dbConnect = require("./database/dbconnect");
const dbc = new dbConnect();
const game = require("../public/js/gameDetails");
const cm = require('./controllers/creaturesManagement')
const im = require('./controllers/itemsController')
const wm = require('./controllers/wallsController')
require('dotenv').config()

const public = require("./public");
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));

const func = require('../public/js/functions');
// let servRequest = false;
// filter data on websocket send


let param;
cm.init();im.init();

( async () => {
  await dbc.init()
  cm.players.init(dbc[game.db])
  app.get('*', (req, res)=> {
    servRequest = req;
    servResponse = res;
    public(req,res,cm.players, dbc)    
  })
  app.post('*', (req, res)=> {
    servRequest = req;
    servResponse = res;
    public(req,res,cm.players, dbc)    
  })
  const server = app.listen(process.env.PORT || 5000)
  // new WebSocketServer({httpServer k: app})
  new WebSocketServer({httpServer : server})
  .on('request', req => {
    const connection = req.accept('echo-protocol', req.origin);
    connection.on('message', data => {
      param = JSON.parse(data.utf8Data);
      // In game actions
      if(Object.keys(param).includes("name")){
        game.time = new Date();
        game.cpu = Math.round((100*(os.totalmem() - os.freemem()))/os.totalmem)+"%";
        // cm.update(param,(output,player)=>{
        cm.update(param,(output,player)=>{
          im.update(output,player,(output)=>{
            wm.update(output, (output)=>{
              connection.sendUTF(stringify(output,null,2));
            })
          })
        }, dbc[game.db])
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

  const date = new Date();
  game.startServerTime = date.getTime();
  console.log("SERWER IS RUNNING");
})()

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
// //   const content = JSON.parse(fs.readFileSync('./public/logs.json','utf-8'));
// //   content.push({"log" : time+": "+val});
// //   fs.writeFileSync('./public/logs.json',stringify(content));
// }
// console.log = (val) => {     
//   extendConsole(val);
//   log.apply(console, args);
// }
// console.error = (val) => {     
//   extendConsole(val);
//   err.apply(console, args);
// }



// HEROKU ANTI IDLING SCRIPT
// const antiIdlingScript = () => {
//   setInterval(() => {
//     http.get(process.env.ORIGIN, (res) => {
//       res.on('data', () => {
//         try {
//           console.log("ANTI IDLING CALL");
//         } catch (err) {
//           console.error("ANTI IDLIG ERROR 1: " + err.message);
//         }
//       });
//     }).on('error', (err) => {
//       // console.error("ANTI IDLIG ERROR 2: " + err.message);
//       console.log("ANTI IDLING SHOT.");
//     });
//   }, 20 * 60 * 1000); // load every 20 minutes
// };antiIdlingScript();