const fs = require('fs');
const func = require("../public/js/functions");
const {URL} = require('url');
const dbConnect = require("./dbconnect");
const dbc = new dbConnect();dbc.init(()=>{});
const game = require("../public/js/gameDetails");
const  {CourierClient} = require("@trycourier/courier");
const courier = CourierClient({authorizationToken:"pk_prod_34BBVC7TP6476APWH0SN5R6HYK6W"});  
const Creature = require("./server_components")[0];
const MarkdownIt = require('markdown-it'),
md = new MarkdownIt();
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
     if (err){
      console.error(err);
       return callback(err);
     } 
  
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
  const href = "https://"+req.rawHeaders[1];
  const myURL = new URL(href+url);
  const vals = {
    name: game.name,
    version: game.version,
    message:"",
    action:"",
    nick:"",
    aside: "",
    js:""
  }
  const fromTemplate = ["",'index','players','libary','rules','404','4devs'];
  let fileName = myURL.pathname.split("/")[1].split(".")[0] == ""?'index':myURL.pathname.split("/")[1].split(".")[0];
  let fileExtension = myURL.pathname.split(".")[myURL.pathname.split(".").length-1] == "/"?'html': myURL.pathname.split(".")[myURL.pathname.split(".").length-1];
  fileExtension == 'js' ? fileExtension = 'javascript':'';
  const allowedFileTypes = ["webp","png","gif","jpg","jpeg","ico"];
  const fileType = allowedFileTypes.includes(fileExtension)?'image':fileExtension == 'json'?'application':'text';
  let contentType = fileType+'/'+fileExtension;
  const serveChangedContent = (path = myURL.pathname) =>{
    if(!path.split("/").includes("public")){
      path = "./public/"+path;
    }
    if(!fs.existsSync(path) 
    && !fromTemplate.includes(fileName) 
    || !allowedFileTypes.concat(['html','css','javascript','json']).includes(fileExtension)){
      fileExtension = "html";
      fileName = "404";
      contentType = "text/html";
    }
    // serve content with message
    res.writeHead(200, { 'Content-Type': contentType });
    if(fileType == 'text'){
      // dynamically generate page by combine template.html and contents.html
      if(fromTemplate.includes(fileName)){
        path = "./public/template.html";
        const allContents = fs.readFileSync("./public/contents.html", "utf8");
        for(const titleAndContent of allContents.split("<!--| ")){
          const [title,content] = titleAndContent.split(" |-->");
          if(title == fileName){
            vals.content = content;
          }
        }
      }
      // console.log(path)
      fs.readFile(path,"utf8",(e,content) => {
        if(e == null){
          if(func.isSet(vals.content)){content = content.split('{{content}}').join(vals.content);}
          for(const v of Object.keys(vals)){
            if(typeof content != "undefined"){
              content = content.split('{{'+v+'}}').join(vals[v]);
            }else{
              if(path == ""){path = "./public/index.html"}
            }
          }
        }else{
          console.error(e);
        }
        res.end(content);
      })
    }else{
      // images
      fs.createReadStream(path).pipe(res);
    }
  }
  if(["/account.html"].includes(myURL.pathname)){  // account page
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
                  if(e != null){console.error(e);}
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
                if(e != null){console.error(e);}
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
              if(e != null){console.error(e);}
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
                if(e != null){console.error(e);}
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
      // wait for connect to db and find player's token.
      let isWaiting = false;
      // check login on cookies
      for(const cookie of req.headers.cookie.split("; ")){
        const [key,value] = cookie.split("=");
        if(key == "token"){
          isWaiting = true;
          dbc[game.db].loadAll((allPlayers)=>{
            // check not logged players [after server crash]
            for(const singlePlayer of allPlayers){
              if(typeof singlePlayer.token != "undefined"){
                player = singlePlayer.name;
                log.ged.push({nick:singlePlayer.name,token:singlePlayer.token})
              }
            }

            // check logged players
            for(const logged of log.ged){
              if(value == logged.token){
                player = logged.nick;
              }
            }   
            // set default GM when is game dev  
            if(game.dev && !player){
              player = "GM"
            }
            if(player){
              path = "./public/game.html";
              vals.nick = player;
            }else{
              path = "./public/account.html";
              vals.message = "Please log in:";
            }
            serveChangedContent(path);
          });
        } 
      }
      if(player){
        path = "./public/game.html";
        vals.nick = player;
      }else{
        path = "./public/account.html";
        vals.message = "Please log in:";
      }
      if(!isWaiting){
        serveChangedContent(path);
      }
    }else{
      path = "./public/account.html";
      vals.message = "Please log in:";
      serveChangedContent(path);
    }  
  }else if(["/players.html"].includes(myURL.pathname)){
    vals.aside = `
      <a href="/players.html?skills=level">Level</a>
      <a href="/players.html?skills=fist">Fist</a>
      <a href="/players.html?skills=dist">Dist</a>
      <a href="/players.html?online=true">Online</a>
    `;
    vals.js += "<script src='./js/components.js?version="+game.version+"'></script>";
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
      serveChangedContent(myURL.pathname);
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
  }else if(["/","/index.html"].includes(myURL.pathname)){
    vals.aside = `<a href="/players.html?online=true">Online list</a>
    <a href="/players.html?lastdeaths=true">Last deaths</a>`;
    if(myURL.pathname == "/"){myURL.pathname = "/index.html"}
    path = myURL.pathname;
    // vals.message = game.whatsNew;
    // const readme = fs.readFileSync("readme.md", "utf8");
    // console.log(readme);
    const result = md.render(fs.readFileSync("readme.md", "utf8"));

    vals.message = result;
    serveChangedContent();
  }else{
    serveChangedContent(myURL.pathname);
  }
}
module.exports = public; 