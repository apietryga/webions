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
const [Creature,Items] = require("./server_components");
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
        console.log(res.nick +" LOGGED OUT")
      }
    }
  }
}
if(game.dev == true){
  log.ged.push({nick:"Tosiek",token:"123"})
}
function public(req, res) {
  const {url} = req;
  const href = "http://"+req.rawHeaders[1];
  const myURL = new URL(href+url);
  const vals = {
    message:"",
    action:"",
    nick:""
  }
  let path = "";
  const serveChangedContent = () => {
    // serve content with message
    fs.readFile(path,"utf8",(e,content) => {
      for(const v of Object.keys(vals)){
        content = content.split('{{'+v+'}}').join(vals[v]);
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    })  
  }
  if(myURL.pathname == "/makewww"){
    // make www htmls
    makewww(()=>{
      // serve www folder
      file.serve(req, res);
    });
  }else if(myURL.pathname == "/account.html"){  // account page
    path = "./public/account.html";
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
  }else if(myURL.pathname == "/game.html"){     // game page
    if(func.isSet(req.headers.cookie)){
      let player = false;
      for(const cookie of req.headers.cookie.split("; ")){
        const [key,value] = cookie.split("=");
        if(key == "token"){
          for(const logged of log.ged){
            if(value == logged.token){
              player = logged.nick;
            }
          }          
          if(game.dev && !player){
            player = "Tosiek"
          }
        } 
      }
      if(player){
        path = "./public/game.html";
        vals.nick = player;
      }else{
        path = "./public/account.html";
        action = "login";
      }

    }else{
      path = "./public/account.html";
      vals.message = "Please log in:";

    }
    serveChangedContent();
  }else{
    // serve main folder
    file.serve(req,res);
  }
}

module.exports = public; 