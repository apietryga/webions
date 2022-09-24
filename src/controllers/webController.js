const MarkdownIt = require('markdown-it'), md = new MarkdownIt();
const fs = require('fs');
const game = require("../../public/js/gameDetails");
const itemTypes = require("../types/itemsTypes").types;
const creatures = require("../types/monstersTypes");
const npcs = require("../lists/npcs").npcs;
const func = require("../../public/js/functions");

module.exports = new class webController {
  constructor(){
    this.vals = { 
      name: game.name,
      version: game.version,
      message:"",
      action:"",
      nick:"",
      aside: "",
      js:""
    }
    this.monsters = [];
    for(const creature of creatures){
      if(typeof creature.type == "undefined" && creature.sprite != "tourets"){
        // monsters.push(creature);
        this.monsters.push(creature);
      }
    }
    this.monstersNames = func.getNamesFromObjArr(this.monsters).concat(func.getNamesFromObjArr(npcs));
  }
  index = (req, res) => {
    this.vals.aside = `
      <a href="/players.html?online=true">Online list</a>
      <a href="/players.html?lastdeaths=true">Last deaths</a>`;
    this.vals.message = md.render(fs.readFileSync("readme.md", "utf8"));
    this.vals.page = 'index'
    res.render("template.njk", this.vals);
  }
  libary = (req, res) => {
    this.vals.aside = `
      <a href="/libary.html?page=install">Install</a>
      <a href="/libary.html?page=controls">Controls</a>
      <a href="/libary.html?page=monsters">Monsters</a>
      <a href="/libary.html?page=items">Items</a>
      <a href="/libary.html?page=about">About</a>`;
    // this.vals.js += `<script>
    //     const monsters = ${JSON.stringify(monsters)};
    //     const items = ${JSON.stringify(itemTypes)};
    //   </script>`;

    // this.vals.items = JSON.stringify(itemTypes)
    // env.addFilter('is_string', function(obj) {
    //   return typeof obj == 'string';
    // });
    this.vals.items = itemTypes
    this.vals.monsters = this.monsters
    this.vals.page = req.url.match(/([a-zA-Z0-9]+)/g)[0]
    res.render("template.njk", this.vals);
  }
  mapeditor = (req, res) => {
    // TODO: AUTH
    res.render("template.njk", this.vals);
  }
  ['4devs'] = (req, res) => {
    this.vals.aside = `<a href="https://github.com/apietryga/webions" target="_blank">GITHUB</a>`;
    this.vals.page = req.url.match(/([a-zA-Z0-9]+)/g)[0]
    res.render("template.njk", this.vals);
  }
  players = (req, res) => {
    this.vals.aside = `
      <a href="/players.html?skills=level">Level</a>
      <a href="/players.html?skills=fist">Fist</a>
      <a href="/players.html?skills=dist">Dist</a>
      <a href="/players.html?skills=def">Def</a>
      <a href="/players.html?skills=magic">Magic</a>
      <a href="/players.html?online=true">Online</a>
      <a href="/players.html?lastdeaths=true">Last&nbsp;Deaths</a>`;
    this.vals.js += "<script src='/js/components.js?version="+game.version+"'></script>";
    // const [key,value] = myURL.search.split("=");
    // if("?skills" == key){
    //   vals.message = "<h1>TOP "+value.charAt(0).toUpperCase() +value.slice(1)+"</h1>";
    // }
    // const content = await dbc[game.db].loadAll()
    // vals.js += "<script>const key = '"+value+"'; </script>";
    // vals.js += "<script>const playerList = '"+JSON.stringify(content)+"';</script>";
    // if("?online=true" == myURL.search){
    //   vals.message = "<h1>Online Players</h1>";
    //   vals.js += "<script>const playersList = "+JSON.stringify(players.list)+";</script>";
    //   serveChangedContent(myURL.pathname);
    // }else if("?lastdeaths=true" == myURL.search){
    //   vals.message = "<h1>Last Deaths</h1>";
    //   vals.js += "<script>const playersList = "+JSON.stringify(content)+";</script>";
    //   serveChangedContent(myURL.pathname);
    // }else{
    //   if("" == myURL.search){
    //     vals.message = "<h1>TOP Players</h1>";
    //   }
    //   const content = await dbc[game.db].loadAll()
    //   vals.js += "<script>const playersList = '"+JSON.stringify(content)+"';</script>";
    //   serveChangedContent(myURL.pathname);
    // }


    this.vals.page = req.url.match(/([a-zA-Z0-9]+)/g)[0]
    res.render("template.njk", this.vals);
  }
  exportplayers = (req, res) => {
    this.vals.page = req.url.match(/([a-zA-Z0-9]+)/g)[0]
    res.render("template.njk", this.vals);
  }
  game = (req, res) => {
    // this.vals.js += "<script>const monstersNames = "+JSON.stringify(monstersNames)+"</script>";
    this.vals.monstersNames = this.monstersNames
    // if(func.isSet(req.headers.cookie)){
    //   let currentPlayer = false;
    //   // wait for connect to db and find player's token.
    //   let isWaiting = false;
    //   // login player from cookies
    //   for(const cookie of req.headers.cookie.split("; ")){
    //     const [key,cookieToken] = cookie.split("=");
    //     if(key == "token"){
    //       isWaiting = true;
    //       const allPlayers = await db.loadAll();
    //       // dbc[game.db].loadAll((allPlayers)=>{
    //         // let cPlayer = false;
    //         for(const singlePlayer of allPlayers){
    //           // find player with cookieToken
    //           if(typeof singlePlayer.token != "undefined"  && singlePlayer.token == cookieToken){
    //             currentPlayer = singlePlayer.name;
    //             break;
    //           }
    //         }
    //         if(currentPlayer){
    //           path = "./public/game.html";
    //           vals.nick = currentPlayer;
    //         }else{
    //           path = "./public/account.html";
    //           vals.message = "Please log in:";
    //         }
    //         serveChangedContent(path);
    //       // });
    //     }
    //   }
    //   if(currentPlayer){
    //     path = "./public/game.html";
    //     vals.nick = currentPlayer;
    //   }else{
    //     path = "./public/account.html";
    //     vals.message = "Please log in :";
    //   }
    //   if(!isWaiting){
    //     serveChangedContent(path);
    //   }
    // }else{
    //   path = "./public/account.html";
    //   vals.message = "Please log in:";
    //   serveChangedContent(path);
    // }
    this.vals.nick = "Tosiek"

    this.vals.page = req.url.match(/([a-zA-Z0-9]+)/g)[0]
    // res.render("template.njk", this.vals);
    res.render("game.njk", this.vals);
  }
  account = async (req, res) => {
    this.vals.monstersNames = this.monstersNames;
    await ( async () => {
    //   const data = req.body
      // if(myURL.search == "?action=logout"){
      if(req.query?.action == "logout"){
        this.vals.js += "<script>delete_cookie('token')</script>";
        this.vals.action = "logout";
        this.vals.message = "<b style='color:green;'>You're succesfully logout.</b>";
        return
      }

    //   if(data.type == "LOGIN"){
    //     // search player in db
    //     if(func.isSet(data.nick)){
    //       const allPlayers = await db.loadAll();
    //       let dbres = false;
    //       const currentTokens = [];
    //       for(const singlePlayer of allPlayers){
    //         // GET TOKENS LIST
    //         if(func.isSet(singlePlayer.token) && singlePlayer.token){
    //           currentTokens.push(singlePlayer.token);
    //         }
    //         // GET CURRENT PLAYER
    //         if(singlePlayer.name == data.nick){
    //           dbres = singlePlayer;
    //         }
    //       }
    //       if(dbres){
    //       // if player is set in db
    //         if(func.isSet(dbres.password)){
    //         // if player register is complete
    //           const h = await password.comparePassword(data.password,dbres.password)
    //           if(h){
    //             // SUCCESFULLY LOGIN
    //             vals.action = "game";
    //             // MAKE NEW UNIQUE TOKEN
    //             let newToken; do {
    //               newToken = (Math.random() + 1).toString(36).substring(2);
    //             } while (currentTokens.includes(newToken));
    //             // UPDATE BROWSER COOKIE TOKEN
    //             vals.message = newToken;
    //             // UPDATE TOKEN IN BASE

    //             // const newPlayer = await players.update({name: data.nick}, dbc[game.db])
    //             // console.log("COMPARE THIS SHIT", {
    //             //   dbres,
    //             //   newPlayer
    //             // })
    //             // console.log("")
    //             // newPlayer.token = newToken;
    //             dbres.token = newToken;
    //             // dbc[game.db].update(newPlayer)
    //             dbc[game.db].update(dbres)
    //           }else{
    //             vals.message = "<b style='color:red'>Wrong password.</b>";
    //           }
    //         }else{
    //         // if player is not fully registered (before v.0.2)
    //           vals.action = "register";
    //           vals.nick = data.nick;
    //           vals.message = "<b style='color:green'>Seems that you have no acc details.<br />Set it up.</b>";
    //         }
    //       }else{
    //       // if player is not in base at all
    //         vals.action = "register";
    //         vals.nick = data.nick;
    //         vals.message = "<b style='color:red'>Player "+data.nick+" not exsists, but you can create it:</b>";
    //       }
    //     }
    //   }else if(data.type == "REGISTER"){
    //     dbc[game.db].load({name:data.nick},(dbres)=>{
    //       // vals.js += "ELOOOOO";
    //       if(dbres){
    //       // if player is set in db
    //         if(func.isSet(dbres.password)){
    //           // player isset
    //           vals.action = "register";
    //           vals.message = "<b style='color:red;'>This account arleady exsits.</b>"
    //           // callback();                
    //         // }else if(func.validateNick(data.nick,monstersNames)[0]){
    //         //   vals.action = "register";
    //         //   vals.message = "<b style='color:red;'>"+func.validateNick(data.nick,monstersNames)[1]+"</b>";
    //         //   callback();                
    //         }else{
    //           // CRYPT PASSWORD
    //           password.cryptPassword(data.password,(e,h)=>{
    //             if(e != null){console.error(e);}
    //             dbres.password = h;
    //             dbres.email = data.email.replace("%40","@");
    //             dbres.sex = data.sex;
    //             dbc[game.db].update(dbres)
    //             vals.action = "result";
    //             vals.message = "<b style='color:green;'>You're succesfully updated your account.</b>";
    //             vals.message += "<br />";
    //             vals.message += "<a href='account.html?action=login'>Click here to login.</a>";
    //             // callback();
    //           });
    //         }
    //       }else{
    //         const validNick = func.validateNick(data.nick,monstersNames);
    //         if(!validNick[0]){
    //           vals.action = "register";
    //           // vals.message = "<b style='color:red;'>"+func.validateNick(data.nick,monstersNames)[1]+"</b>";
    //           vals.message = "<b style='color:red;'>"+validNick[1]+"</b>";
    //           // callback();                
    //         }else{
    //         // making new player
    //           const newPlayer = new Creature(validNick[1]);
    //           password.cryptPassword(data.password,(e,h)=>{
    //             if(e != null){console.error(e);}
    //             newPlayer.password = h;
    //             newPlayer.email = data.email.replace("%40","@");
    //             newPlayer.sex = data.sex;
    //             dbc[game.db].update(newPlayer);
    //             vals.action = "result";
    //             vals.message = "<b style='color:green;'>You're succesfully created your account.</b>";
    //             vals.message += "<br />";
    //             vals.message += "<a href='account.html?action=login'>Click here to login.</a>";
    //             // callback();
    //           });
    //         }
    //       }
    //     }) 
    //   }else if(data.type == "REMIND"){
    //     dbc[game.db].load({name:data.nick},(dbres)=>{
    //       if(dbres){
    //         if(func.isSet(dbres.email)){
    //           const passToken = myURL.origin+"/account.html?action=newpass&passToken="+passTokens.generate(data.nick).passToken;
    //           mailgun.sendRaw(
    //             process.env.MAILGUN_SMTP_LOGIN,
    //             [dbres.email],
    //             'From: '+game.name+' <' + process.env.MAILGUN_SMTP_LOGIN+'>' +
    //             '\nTo: '+data.nick+' <' + dbres.email + '>' +
    //             '\nMIME-Version: 1.0' +
    //             '\nContent-Type: text/html; charset=UTF-8' +
    //             '\nSubject: '+data.nick+' - Forgotten Password in '+game.name +
    //             '\n\n<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><style>.wrapper{border:2px solid rgba(0, 0, 0, 0.8);background-color: #000000cc;}img{background-color:rgba(0, 0, 0, 0.8);}header{display:flex;align-items: center;padding:10px;}header img{width:4em;height:4em;margin-right:1em;}.wrapper > a{text-decoration:none;color:#fff;}.main,footer{padding:20px;}.main a{color:blue;}.main{background-color:#fff;}footer,footer a{color:#fff;}</style></head><body><div class="wrapper">'+
    //             '<a href="'+myURL.origin+'"><header><img src="'+myURL.origin+'/apple-touch-icon.png">'+
    //             '<h1>'+game.name+'</h1></header></a><div class="main">Hello, <br /> You see this mail, because probably u forgot password,<br />- If its true, <a href="'+
    //             passToken+'">click here</a> to reset it.<br />- If smthing wrong, retype link below to your browser: <br />'+
    //             passToken+'<br /><br />- If you never seen '+game.name+' game, please ignore this mail, or contact in our support - probably somebody make account on your email.<br /></div><footer>Best regards<br />'+
    //             game.name +'team.  <br /><a href="'+myURL.origin+'">'+myURL.origin+'</a></footer></div></body></html>',
    //             (err) => {
    //               console.error(err) 
    //               vals.action = "result";
    //               vals.message = err == null?"<b style='color:green;'>Check your email for details.<br />You have 5 minutes for it.<br />Check your spam folder</b>":"<b style='color:red;'>Something went wrong. If you're server owner, find mailgun settings in docs</b>";
    //               callback();
    //             }
    //           )
    //         }else{
    //           vals.action = "result";
    //           vals.message = "<b style='color:red;'>Player "+data.nick+" have no email setted.</b>";
    //           callback();
    //         }
    //       }else{
    //         vals.action = "forgot";
    //         vals.message = "<b style='color:red;'>Player "+data.nick+" not exists.</b>";
    //         callback();
    //       }          
    //     })
    //   }else if(data.type == "CHANGE"){
    //     if(data.passToken == "" || data.passToken == "undefined"){
    //       vals.action = "forgot";
    //       vals.message = "<b style='color:red;'>Something go wrong, try again:</b>"
    //       callback();
    //     }else{
    //       // check passtoken
    //       const pName = passTokens.validate(data.passToken);
    //       if(pName){
    //         // get player from base
    //         dbc[game.db].load({name:pName},(dbres)=>{
    //           // CRYPT PASSWORD
    //           password.cryptPassword(data.newpass,(e,h)=>{
    //             if(e != null){console.error(e);}
    //             dbres.password = h;
    //             dbc[game.db].update(dbres)
    //             vals.action = "login";
    //             vals.message = "<b style='color:green;'>You're succesfully updated your password.<br /> Please log in:</b>";
    //             callback();
    //           });
    //         });
    //       }else{
    //         vals.action = "forgot";
    //         vals.message = "<b style='color:red;'>Something go wrong, try again:</b>"
    //         callback();
    //       }
    //     }
    //   }
    // // }
    })()

    this.vals.page = req.url.match(/([a-zA-Z0-9]+)/g)[0]
    res.render("account.njk", this.vals);
  }
  
}