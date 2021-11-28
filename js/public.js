const fs = require('fs');
const func = require("../public/js/functions");
const {URL} = require('url');
const static = require('node-static');
const file = new(static.Server)("public");
const makewww = require("../public/makewww");
const dbConnect = require("./dbconnect");
const dbc = new dbConnect();dbc.init(()=>{});
const game = require("../public/js/gameDetails");
const  {CourierClient} = require("@trycourier/courier");
const courier = CourierClient({authorizationToken:"pk_prod_34BBVC7TP6476APWH0SN5R6HYK6W"});  
const Creature = require("./server_components")[0];
const passTokens = {
  vals : [],
  generate(pName){
    const record = {
      nick : pName,
      passToken : (Math.random() + 1).toString(36).substring(2),
      expires : new Date().getTime() + 300000
    }
    this.vals.push(record);
    return record;
  },
  validate(passToken){
    let valid = false;
    for(const record of this.vals){
      if(record.expires <= new Date().getTime()){
        this.vals.splice(this.vals.indexOf(record),1);
      }else{
        if(record.passToken == passToken){
          valid = record.nick;
        }
      }
    }
    return valid;
  }
}
const bcrypt = require('bcrypt');
password = {
  cryptPassword : (password, callback) => {
    bcrypt.genSalt(10, function(err, salt) {
     if (err) 
       return callback(err);
  
     bcrypt.hash(password, salt, function(err, hash) {
       return callback(err, hash);
     });
   });
  },
  comparePassword : (plainPass, hashword, callback) => {
    bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch) {   
        return err == null ?
            callback(null, isPasswordMatch) :
            callback(err);
    });
  }
}
const log = {
  ged : [],
  in(nick){
    const res = {
      nick: nick,
      token: (Math.random() + 1).toString(36).substring(2),
    }
    this.ged.push(res);
    return res.token;
  },
  out(nick){
    for(const res of this.ged){
      if(res.nick == nick){
        this.ged.splice(this.ged.indexOf(res),1);
      }
    }
  }
}
if(game.dev == true){
  log.ged.push({nick:"GM",token:"123"})
}
function public(req, res, playersList) {
  const {url} = req;
  const href = "http://"+req.rawHeaders[1];
  const myURL = new URL(href+url);
  const vals = {
    name: game.name,
    message:"",
    action:"",
    nick:"",
    aside: "",
    js:""
  }
  const serveChangedContent = (path = myURL.pathname) =>{
    if(!path.split("/").includes("public")){
      path = "./public/"+path;
    }
    // serve content with message
    fs.readFile(path,"utf8",(e,content) => {
      if(e != null){console.error(e);}
      for(const v of Object.keys(vals)){
        if(typeof content != "undefined"){
          content = content.split('{{'+v+'}}').join(vals[v]);
        }else{
          if(path == ""){path = "./public/index.html"}
        }
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    })
  }
  if(["/makewww"].includes(myURL.pathname)){
    // make www htmls
    makewww(()=>{
      // serve www folder
      file.serve(req, res);
    });
  }else if(["/account.html"].includes(myURL.pathname)){  // account page
    path = "/account.html";
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
                password.comparePassword(data.password,dbres.password,(e,h)=>{
                  if(h){
                    // path = "./public/game.html"
                    vals.action = "game";
                    vals.message = log.in(dbres.name);
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
          if(myURL.search == "?action=logout"){
            // res.cookie("token", "");
            // res.setHeader('set-cookie', 'mycookie=; max-age=0');
                        // cookies.set('testtoken', {expires: Date.now()});
            // res.clearCookie("token");
            vals.js = "<script>delete_cookie('token')</script>";
            vals.action = "logout";
            vals.message = "<b style='color:green;'>You're succesfully logout.</b>";
          }
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
              password.cryptPassword(data.password,(e,h)=>{
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
            const newPlayer = new Creature(data.nick);
            password.cryptPassword(data.password,(e,h)=>{
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
        dbc[game.db].load({name:data.nick},(dbres)=>{
          if(dbres){
            if(func.isSet(dbres.email)){
              courier.send ({
                eventId: "F2N3F5QTN0MZRDHVPGK4RSQAXQE6",
                recipientId: "webionsgame@gmail.com",
                profile: {
                  email: dbres.email
                },
                data: {
                  passToken: "https://webions.herokuapp.com/account.html?action=newpass&passToken="+passTokens.generate(data.nick).passToken
                }
              })
              .then(()=>{
                vals.action = "result";
                vals.message = "<b style='color:green;'>Check your email for details.<br />You have 5 minutes for it.</b>";
                callback();
              })
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
      }else if(data.type == "CHANGE"){
        if(data.passToken == "" || data.passToken == "undefined"){
          vals.action = "forgot";
          vals.message = "<b style='color:red;'>Something go wrong, try again:</b>"
          callback();
        }else{
          // check passtoken
          const pName = passTokens.validate(data.passToken);
          if(pName){
            // get player from base
            dbc[game.db].load({name:pName},(dbres)=>{
              // CRYPT PASSWORD
              password.cryptPassword(data.newpass,(e,h)=>{
                dbres.password = h;
                dbc[game.db].update(dbres)
                vals.action = "login";
                vals.message = "<b style='color:green;'>You're succesfully updated your password.<br /> Please log in:</b>";
                callback();
              });
            });
          }else{
            vals.action = "forgot";
            vals.message = "<b style='color:red;'>Something go wrong, try again:</b>"
            callback();
          }
        }
      }
    }
    req.on("end", ()=>{processRequest(serveChangedContent)});
  }else if(["/game.html"].includes(myURL.pathname)){     // game page
    if(func.isSet(req.headers.cookie)){
      let player = false;
      // check login on cookies
      for(const cookie of req.headers.cookie.split("; ")){
        // const all
        const [key,value] = cookie.split("=");
        if(key == "token"){
          for(const logged of log.ged){
            if(value == logged.token){
              player = logged.nick;
            }
          }          
          if(game.dev && !player){
            player = "GM"
          }
        } 
      }
      if(player){
        path = "./public/game.html";
        vals.nick = player;
      }else{
        path = "./public/account.html";
        vals.message = "Please log in:";
      }
    }else{
      path = "./public/account.html";
      vals.message = "Please log in:";

    }
    serveChangedContent(path);
  }else if(["/","/index.html"].includes(myURL.pathname)){
    vals.aside = `<a href="/players.html?online=true">Online list</a>
    <a href="/players.html?lastdeaths=true">Last deaths</a>`
    if(myURL.pathname == "/"){myURL.pathname = "/index.html"}
    path = myURL.pathname;
    let body = '';req.on("data",(chunk)=>{body += chunk;});
    const processRequest = (callback = ()=>{}) => {
      vals.message = game.whatsNew;
      callback();
    } 
    processRequest(serveChangedContent(myURL.pathname))
  }else if(["/players.html"].includes(myURL.pathname)){
    vals.aside = `
      <a href="/players.html?skills=level">Level</a>
      <a href="/players.html?skills=fist">Fist</a>
      <a href="/players.html?skills=dist">Dist</a>
      <a href="/players.html?online=true">Online</a>
    `;
    vals.js += "<script src='./js/components.js'></script>";
    const [key,value] = myURL.search.split("=");
    if("?skills" == key){
      vals.message = "<h1>TOP "+value.charAt(0).toUpperCase() +value.slice(1)+"</h1>";
    }
    dbc[game.db].loadAll((content)=>{
      vals.js += "<script>const key = '"+value+"'; </script>";
      vals.js += "<script>const playerList = '"+JSON.stringify(content)+"';</script>";
    })
    if("?online=true" == myURL.search){
      vals.message = "<h1>Online Players</h1>";
      dbc[game.db].loadAll((content)=>{
        vals.js += "<script>const playersList = "+JSON.stringify(playersList)+";</script>";
        serveChangedContent(myURL.pathname);
      })
    }else if("?lastdeaths=true" == myURL.search){
      vals.message = "<h1>Last Deaths</h1>";
      dbc[game.db].loadAll((content)=>{
        vals.js += "<script>const playersList = "+JSON.stringify(content)+";</script>";
        serveChangedContent(myURL.pathname);
      })
    }else{
      if("" == myURL.search){
        vals.message = "<h1>TOP Players</h1>";
      }
      dbc[game.db].loadAll((content)=>{
        vals.js += "<script>const playersList = '"+JSON.stringify(content)+"';</script>";
        serveChangedContent(myURL.pathname);
      })
    }
  }else if(["/4devs.html"].includes(myURL.pathname)){
    vals.aside = `<a href="https://github.com/apietryga/webions2" target="_blank">GITHUB</a>`;
    serveChangedContent(myURL.pathname);
  }else if(["/mapeditor.html"].includes(myURL.pathname)){
    if(game.dev == true){
      file.serve(req,res)
    }else{
      const location = "/index.html"
      res.setHeader("Location", location + "junk");
      res.setHeader("Content-Type", 'text/html');
      res.end(`Open devTools to edit map 
              <a href="/4devs.html" target='_blank'> more </a>
              <br />
              Done? <br >
              <a href="/mapeditor.html">REFRESH</a>`);
    }
  }else if(["/libary.html"].includes(myURL.pathname)){
    vals.aside = `
    <a href="/libary.html#install">Install</a>
    <a href="/libary.html#controls">Controls</a>
    <a href="/libary.html#monsters">Monsters</a>
    <a href="/libary.html#items">Items</a>
    `;
    // filter creatures to monsters only
    const creatures = require("./monstersTypes");
    const monsters = [];
    for(const creature of creatures){
      if(typeof creature.type == "undefined" && creature.sprite != "tourets"){
        monsters.push(creature);
      }
    }
    vals.js = `<script>
        const monsters = ${JSON.stringify(monsters)};
        const items = ${JSON.stringify(require("./itemsTypes").types)};
    </script>`;
    serveChangedContent(myURL.pathname);
  }else if([".html"].includes(myURL.pathname.slice(-4))){
    console.log(myURL.pathname);
  }else{
    file.serve(req,res)
  }
}
module.exports = public; 