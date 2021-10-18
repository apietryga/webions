// 3-7,
const fs = require('fs');
const http = require('http');
const {URL} = require('url');
const Map = require("./js/map");
const map = new Map();
const os = require("os");
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
const game = require("./js/gameDetails");
const func = require("./js/functions");
const nodemailer = require('nodemailer');

function handler(req, res) {
  const {url} = req;
  const href = "http://"+req.rawHeaders[1];
  const myURL = new URL(href+url);
  const www = [   // static www files: 
    "/",
    "/index.html",
    "/howtoplay.html",
    "/players.html",
    "/rules.html",
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
    // account page
    if(myURL.pathname == "/account.html"){
      const vals = {
        message:"",
        action:"",
        nick:""
      }
      let body = '';req.on("data",(chunk)=>{body += chunk;});
      const processRequest = (callback) => {
        const data = (body == '')?{type:"LOGIN"}:JSON.parse('{"' + decodeURI(body).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"').replace(/\s/g,'') + '"}');
        if(data.type == "LOGIN"){
          // search player in db
          if(func.isSet(data.nick)){
            dbc[game.db].load({name:data.nick},(dbres)=>{
              if(dbres){
              // if player is set in db
                if(func.isSet(dbres.password)){
                // if player is complete registered.
                  func.comparePassword(data.password,dbres.password,(e,h)=>{
                    if(h){
                      vals.message = "CORRECT.";
                    }else{
                      vals.message = "<b style='color:red'>Wrong password.</b>";
                    }
                    callback();
                  });                
                }else{
                // if player is not fully registered (before v.0.2)
                  vals.action = "register";
                  vals.nick = data.nick;
                  vals.message = "<b style='color:green'>Seems that you have no acc details.<br />Set it up.</b>";
                  callback();
                }
              }else{
              // if player is not in base at all
                vals.action = "register";
                vals.nick = data.nick;
                vals.message = "<b style='color:red'>Player "+data.nick+" not exsists, but you can create it:</b>";
                callback();
              }
            })
          }else{
            callback();
          }
        }else if(data.type == "REGISTER"){
          dbc[game.db].load({name:data.nick},(dbres)=>{
            if(dbres){
            // if player is set in db
              if(func.isSet(dbres.password)){
                // player isset
                vals.action = "register";
                vals.message = "<b style='color:red;'>This account arleady exsits.</b>"
                callback();                
              }else{
                // CRYPT PASSWORD
                func.cryptPassword(data.password,(e,h)=>{
                  dbres.password = h;
                  dbres.email = data.email.replace("%40","@");
                  dbres.sex = data.sex;
                  dbc[game.db].update(dbres)
                  vals.action = "result";
                  vals.message = "<b style='color:green;'>You're succesfully updated your account.</b>";
                  vals.message += "<br />";
                  vals.message += "<a href='account.html?action=login'>Click here to login.</a>";
                  callback();
                });
              }
            }else{
            // making new player
              const newPlayer = new Creature(data.nick,0);
              func.cryptPassword(data.password,(e,h)=>{
                newPlayer.password = h;
                newPlayer.email = data.email.replace("%40","@");
                newPlayer.sex = data.sex;
                dbc[game.db].update(newPlayer);
                vals.action = "result";
                vals.message = "<b style='color:green;'>You're succesfully created your account.</b>";
                vals.message += "<br />";
                vals.message += "<a href='account.html?action=login'>Click here to login.</a>";
                callback();
              });
            }
          }) 
        }else if(data.type == "REMIND"){
          console.log(data);
          console.log("FORGOTTEN PASSWORD!");
          dbc[game.db].load({name:data.nick},(dbres)=>{
            if(dbres){
              if(func.isSet(dbres.email)){
                const transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    type: 'OAuth2',
                    user: 'webionsgame@gmail.com',
                    pass: 'yourpassword'
                  }
                });
                const mailOptions = {
                  from: transporter.auth.user,
                  to: dbres.email,
                  subject: 'Sending Email using Node.js',
                  html: `
                    <h1>WEBIONS</h1>
                    <p>Here's the message</p>
                  `
                };
                transporter.sendMail(mailOptions, function(error, info){
                  vals.action = "result";
                  if (error) {
                    console.log(error);
                    vals.message = "<b style='color:red;'>There's error on our way. <br />Try again later.</b>";
                  } else {
                    console.log('Email sent: ' + info.response);
                    vals.message = "<b style='color:green;'>Check your email for details.</b>";
                  }
                  callback();
                });  
              }else{
                vals.action = "result";
                vals.message = "<b style='color:red;'>Player "+data.nick+" have no email setted.</b>";
                callback();
              }
            }else{
              vals.action = "forgot";
              vals.message = "<b style='color:red;'>Player "+data.nick+" not exists.</b>";
              callback();
            }          
          })

        }
      }
      // serve content with message
      const serveChangedContent = () => {
        fs.readFile("./account.html","utf8",(e,content) => {
          for(const v of Object.keys(vals)){
            content = content.split('{{'+v+'}}').join(vals[v]);
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content);
        })  
      }
      req.on("end", ()=>{processRequest(serveChangedContent)});
    }
    // game page
    else if(myURL.pathname == "/game.html"){
      fs.readFile("./game.html","utf8",(e,content) => {
        content = content.split('{{version}}').join(game.version);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      })
    }else{
      // serve main folder
      file2.serve(req,res);
    }
  }
}
const cm = { // creatures managment
  allMonsters: [],
  // monsters: [],
  monstersInArea: [],
  loadMonsters(){
    for(const m of inGameMonsters){
      const monster = new Creature(m.name,this.allMonsters.length);
      for(const k of Object.keys(m)){
        monster[k] = m[k];
      }
      // monster.defaultCyle = monster.cyle;
      // monster.defaultDirection = monster.direction;
      monster.startPosition = m.position;
      monster.type = "monster";
      for(const sm of monstersList){ // single monster
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
      c.update(param,game,this.monstersInArea.concat(this.players.list));
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
      const newData = {
        game: game,
        creatures: this.players.list.concat(this.monstersInArea)
      }
      callback(newData);
      // retrive died player
      if(typeof game.dead != "undefined"){
        delete game.dead;
        player.position = player.startPosition;
        player.health = player.maxHealth;
        player.cyle = 0;
        player.direction = 1;
        this.players.kick(player);        
      }
      player.text = "";
    })
  },
  players: {
    list:[],
    inArea:[],
    inLoading:[],
    update(param,callback){
      // TO DO MAKE inArea PLAYERS LIST!
      // check if player is on the list.
      let isPlayer = false;
      // for(const c of this.list){
      //   if(Math.abs( c.position[0] - player.position[0] ) < 7
      //   && Math.abs( c.position[1] - player.position[1] ) < 7){
      //     this.inArea.push(c);
      //   }
      // }
      for(const p of this.list){
        // update player is exists
        if(p.name == param.name){
          isPlayer = p;
          isPlayer.lastFrame = game.time.getTime();
          isPlayer.update(param,game,cm.monstersInArea.concat(this.list));
          callback(isPlayer);
          break;
        }
      }

      // push player to list
      if(isPlayer == false && !this.inLoading.includes(param.name)){
        this.inLoading.push(param.name);
        //  make new unique id
        const ids = [];
        for(let plr of this.list.concat(cm.allMonsters)){ids.push(plr.id);}
        let newID = 1;
        while(ids.includes(newID)){newID++;}
        
        // get info from srv;
        const newPlayer = new Creature(param.name,newID-1);
        dbc[game.db].load(newPlayer,(res)=>{
          if(res){
            // merge it with newPlayer
            const defaultPosition = newPlayer.position;
            for(const k of Object.keys(res)){
              newPlayer[k] = res[k];
            }
            if(newPlayer.lastFrame < game.lastUpdate){
              newPlayer.position = defaultPosition;
            }

          }else{
            // create record
            dbc[game.db].update(newPlayer);
          }
          newPlayer.type = "player";
          newPlayer.lastFrame = game.time.getTime();
          this.inLoading.splice(this.inLoading.indexOf(param.name),1);     
          this.list.push(newPlayer);
          callback(newPlayer);
        }); 
      }
      
      // kick off offline.
      setTimeout(() => {
        if(typeof isPlayer == "object" 
          && new Date().getTime() - isPlayer.lastFrame > 1000
          && this.list.includes(isPlayer)){
            cm.players.kick(isPlayer)
            // dbc[game.db].update(isPlayer);
            // this.list.splice(this.list.indexOf(isPlayer),1);
        }
      }, 1500);
    },
    kick(player){
      this.list.splice(this.list.indexOf(player),1);
      dbc[game.db].update(player);
    }

  }
}
let param;cm.init();
dbc.init(()=>{
  console.log("Database set: "+game.db);
  const server = http.createServer(handler).listen(process.env.PORT || 80);
  // app.listen(process.env.PORT || 80,()=>{})
  console.log("serwer is running on: http://webions");
  // WEBSOCKET
  new WebSocketServer({httpServer : server})
  // const wsServer = new WebSocketServer({httpServer : app})
  .on('request', (req)=>{
    const connection = req.accept('echo-protocol', req.origin);
    connection.on('message', (data) => {
      param = JSON.parse(data.utf8Data);
      // In game actions
      if(Object.keys(param).includes("name")){
        game.time = new Date();
        game.cpu = Math.round((100*(os.totalmem() - os.freemem()))/os.totalmem)+"%";
        cm.update(param,(newData)=>{
          connection.sendUTF(stringify(newData,null,2));
        })
      }
      // Getting data
      if(Object.keys(param).includes("get")){
        const mapPatch = map.path;
        // Get playersList
        if(param.get == "playersList"){
          dbc[game.db].loadAll((result)=>{
            connection.sendUTF(stringify(result,null,2));
          })
        }
        // Get gameMap
        if(param.get == "map"){
          const mapRead = fs.readFileSync(mapPatch,{encoding:'utf8'});
          const mapArr = JSON.parse(mapRead);
          // result = map;
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