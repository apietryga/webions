const GameMap = require("../../public/js/map");
const map = new GameMap();
const fs = require('fs');
const os = require("os");
const stringify = require("json-stringify-pretty-compact");
const WebSocketServer = require("websocket").server;
const wm = require('../controllers/wallsController')
const game = require("../../public/js/gameDetails");

const wsController = (server, cm, im, dbconnect) => {
  new WebSocketServer({httpServer : server})
  .on('request', req => {
    const connection = req.accept('echo-protocol', req.origin);
    connection.on('message',async data => {
      param = JSON.parse(data.utf8Data);
      // In game actions
      if(Object.keys(param).includes("name")){
        game.time = new Date();
        game.cpu = Math.round((100*(os.totalmem() - os.freemem()))/os.totalmem)+"%";
        let [ output, player ] = await cm.update(param, dbconnect)
        im.update(output,player,(output)=>{
          wm.update(output, (output)=>{
            connection.sendUTF(stringify(output,null,2));
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
}


// module.exports = WebSocketServer
module.exports = wsController