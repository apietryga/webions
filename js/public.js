const fs = require('fs');
const func = require("../public/js/functions");
const URL = require('url').URL;
const dbConnect = require("../src/dbconnect"), dbc = new dbConnect();dbc.init(()=>{});
const game = require("../public/js/gameDetails");
const Mailgun = require("mailgun").Mailgun, mailgun = new Mailgun(process.env.MAILGUN_API_KEY);
const Creature = require("../src/components/Creature");
const MarkdownIt = require('markdown-it'), md = new MarkdownIt();
const bcrypt = require('bcrypt');
const mime = require('mime-types');
// filter creatures to monsters only
const creatures = require("../src/types/monstersTypes");
const npcs = require("../src/lists/npcs").npcs;
const monsters = [];
for(const creature of creatures){
  if(typeof creature.type == "undefined" && creature.sprite != "tourets"){
    monsters.push(creature);
  }
}
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
const password = {
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
      return err == null ? callback(null, isPasswordMatch) : callback(err);
    });
  }
}
const public = (req, res, players) => {
  const myURL = new URL("https://"+req.rawHeaders[1]+req.url);
  const vals = {
    name: game.name,
    version: game.version,
    message:"",
    action:"",
    nick:"",
    aside: "",
    js:""
  }
  const fromTemplate = [''];
  const fileName = myURL.pathname.split("/")[1].split(".")[0] == "" ? 'index' : myURL.pathname.split("/")[1].split(".")[0];
  const allContents = fs.readFileSync("./public/contents.html", "utf8");
  for(const titleAndContent of allContents.split("<!--| ")){
    const [title,content] = titleAndContent.split(" |-->");
    fromTemplate.push(title);
    if(title == fileName){
      vals.content = content;
    }
    if(title == "404"){
      vals.e404 = content;
    }
  }
  let contentType = mime.contentType(myURL.pathname.split(".")[myURL.pathname.split(".").length-1]);
  if(contentType == "/"){contentType = 'text/html';}
  const serveChangedContent = (path = myURL.pathname) =>{
    if(!path.split("/").includes("public")){
      path = "./public"+path;
    }

    if(!fs.existsSync(path) && !fromTemplate.includes(fileName) || (fromTemplate.includes(fileName) && !['text/html; charset=utf-8','text/html'].includes(contentType))){
        contentType = "text/html";
        vals.content = vals.e404;
        path = "./public/template.html"
        vals.aside = " <a href='/players.html'>Players</a>";
        vals.aside +=" <a href='/libary.html?page=monsters'>Monsters</a>";
        vals.aside +=" <a href='/libary.html?page=items'>Items</a>";
        vals.aside +=" <a href='/players.html?online=true'>Online</a>";
        vals.aside +=" <a href='/players.html?lastdeaths=true'>Last Deaths</a>";
    }

    // serve content with message
    res.writeHead(200, { 'Content-Type': contentType });
    if(['image'].includes(contentType.split("/")[0])){
      fs.createReadStream(path).pipe(res);
    }else{
      // dynamically generate page by combine template.html and contents.html
      if(fromTemplate.includes(fileName)){
        path = "./public/template.html";
      }
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
        // SCRIPT USES IN ALL HTML's
        if(['text/html; charset=utf-8','text/html'].includes(contentType) && path != "/offline.html"){
          content += "<script src='/js/scriptEverywhere.js?v="+game.version+"'></script>";
        }
        res.end(content);
      })
    }
  }
  const monstersNames = func.getNamesFromObjArr(monsters).concat(func.getNamesFromObjArr(npcs));
  if(["/account.html"].includes(myURL.pathname)){
    path = "/account.html";
    let body = '';req.on("data",(chunk)=>{body += chunk;});
    vals.js += "<script>const monstersNames = "+JSON.stringify(monstersNames)+"</script>";
    const processRequest = (callback) => {
      const data = (body == '')?{type:"LOGIN"}:JSON.parse('{"' + decodeURI(body).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"').replace(/\s/g,'') + '"}');
      if(data.type == "LOGIN"){
        // search player in db
        if(func.isSet(data.nick)){
          dbc[game.db].loadAll( (allPlayers) => {
            let dbres = false;
            const currentTokens = [];
            for(const singlePlayer of allPlayers){
              // GET TOKENS LIST
              if(func.isSet(singlePlayer.token) && singlePlayer.token){
                currentTokens.push(singlePlayer.token);
              }
              // GET CURRENT PLAYER
              if(singlePlayer.name == data.nick){
                dbres = singlePlayer;
              }
            }
            if(dbres){
            // if player is set in db
              if(func.isSet(dbres.password)){
              // if player register is complete
                password.comparePassword(data.password,dbres.password,(e,h)=>{
                  if(e != null){console.error(e);}
                  if(h){
                    // SUCCESFULLY LOGIN
                    vals.action = "game";
                    // MAKE NEW UNIQUE TOKEN
                    let newToken; do {
                      newToken = (Math.random() + 1).toString(36).substring(2);
                    } while (currentTokens.includes(newToken));
                    // UPDATE BROWSER COOKIE TOKEN
                    vals.message = newToken;
                    // UPDATE TOKEN IN BASE
                    players.update({name: data.nick}, (newPlayer) => {
                      newPlayer.token = newToken;
                      newPlayer.skills.level = -1;
                      newPlayer.updateSkills(dbc[game.db]);
                    })
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
            vals.js += "<script>delete_cookie('token')</script>";
            vals.action = "logout";
            vals.message = "<b style='color:green;'>You're succesfully logout.</b>";
          }
          callback();
        }
      }else if(data.type == "REGISTER"){
        dbc[game.db].load({name:data.nick},(dbres)=>{
          // vals.js += "ELOOOOO";
          if(dbres){
          // if player is set in db
            if(func.isSet(dbres.password)){
              // player isset
              vals.action = "register";
              vals.message = "<b style='color:red;'>This account arleady exsits.</b>"
              callback();                
            // }else if(func.validateNick(data.nick,monstersNames)[0]){
            //   vals.action = "register";
            //   vals.message = "<b style='color:red;'>"+func.validateNick(data.nick,monstersNames)[1]+"</b>";
            //   callback();                
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
            const validNick = func.validateNick(data.nick,monstersNames);
            if(!validNick[0]){
              vals.action = "register";
              // vals.message = "<b style='color:red;'>"+func.validateNick(data.nick,monstersNames)[1]+"</b>";
              vals.message = "<b style='color:red;'>"+validNick[1]+"</b>";
              callback();                
            }else{
            // making new player
              const newPlayer = new Creature(validNick[1]);
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
          }
        }) 
      }else if(data.type == "REMIND"){
        dbc[game.db].load({name:data.nick},(dbres)=>{
          if(dbres){
            if(func.isSet(dbres.email)){
              const passToken = myURL.origin+"/account.html?action=newpass&passToken="+passTokens.generate(data.nick).passToken;
              mailgun.sendRaw(
                process.env.MAILGUN_SMTP_LOGIN,
                [dbres.email],
                'From: '+game.name+' <' + process.env.MAILGUN_SMTP_LOGIN+'>' +
                '\nTo: '+data.nick+' <' + dbres.email + '>' +
                '\nMIME-Version: 1.0' +
                '\nContent-Type: text/html; charset=UTF-8' +
                '\nSubject: '+data.nick+' - Forgotten Password in '+game.name +
                '\n\n<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><style>.wrapper{border:2px solid rgba(0, 0, 0, 0.8);background-color: #000000cc;}img{background-color:rgba(0, 0, 0, 0.8);}header{display:flex;align-items: center;padding:10px;}header img{width:4em;height:4em;margin-right:1em;}.wrapper > a{text-decoration:none;color:#fff;}.main,footer{padding:20px;}.main a{color:blue;}.main{background-color:#fff;}footer,footer a{color:#fff;}</style></head><body><div class="wrapper">'+
                '<a href="'+myURL.origin+'"><header><img src="'+myURL.origin+'/apple-touch-icon.png">'+
                '<h1>'+game.name+'</h1></header></a><div class="main">Hello, <br /> You see this mail, because probably u forgot password,<br />- If its true, <a href="'+
                passToken+'">click here</a> to reset it.<br />- If smthing wrong, retype link below to your browser: <br />'+
                passToken+'<br /><br />- If you never seen '+game.name+' game, please ignore this mail, or contact in our support - probably somebody make account on your email.<br /></div><footer>Best regards<br />'+
                game.name +'team.  <br /><a href="'+myURL.origin+'">'+myURL.origin+'</a></footer></div></body></html>',
                (err) => {
                  console.error(err) 
                  vals.action = "result";
                  vals.message = err == null?"<b style='color:green;'>Check your email for details.<br />You have 5 minutes for it.<br />Check your spam folder</b>":"<b style='color:red;'>Something went wrong. If you're server owner, find mailgun settings in docs</b>";
                  callback();
                }
              )
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
  }else if(["/game.html"].includes(myURL.pathname)){
    vals.js += "<script>const monstersNames = "+JSON.stringify(monstersNames)+"</script>";
    if(func.isSet(req.headers.cookie)){
      let currentPlayer = false;
      // wait for connect to db and find player's token.
      let isWaiting = false;
      // login player from cookies
      for(const cookie of req.headers.cookie.split("; ")){
        const [key,cookieToken] = cookie.split("=");
        if(key == "token"){
          isWaiting = true;
          dbc[game.db].loadAll((allPlayers)=>{
            // let cPlayer = false;
            for(const singlePlayer of allPlayers){
              // find player with cookieToken
              if(typeof singlePlayer.token != "undefined"  && singlePlayer.token == cookieToken){
                currentPlayer = singlePlayer.name;
                break;
              }
            }
            if(currentPlayer){
              path = "./public/game.html";
              vals.nick = currentPlayer;
            }else{
              path = "./public/account.html";
              vals.message = "Please log in:";
            }
            serveChangedContent(path);
          });
        }
      }
      if(currentPlayer){
        path = "./public/game.html";
        vals.nick = currentPlayer;
      }else{
        path = "./public/account.html";
        vals.message = "Please log in :";
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
      <a href="/players.html?skills=def">Def</a>
      <a href="/players.html?skills=magic">Magic</a>
      <a href="/players.html?online=true">Online</a>
      <a href="/players.html?lastdeaths=true">Last&nbsp;Deaths</a>
    `;
    vals.js += "<script src='/js/components.js?version="+game.version+"'></script>";
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
        vals.js += "<script>const playersList = "+JSON.stringify(players.list)+";</script>";
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
    <a href="/libary.html?page=install">Install</a>
    <a href="/libary.html?page=controls">Controls</a>
    <a href="/libary.html?page=monsters">Monsters</a>
    <a href="/libary.html?page=items">Items</a>
    <a href="/libary.html?page=about">About</a>
    `;
    vals.js += `<script>
        const monsters = ${JSON.stringify(monsters)};
        const items = ${JSON.stringify(require("../src/types/itemsTypes").types)};
    </script>`;
    serveChangedContent(myURL.pathname);
  }else if(["/","/index.html"].includes(myURL.pathname)){
    vals.aside = `<a href="/players.html?online=true">Online list</a>
    <a href="/players.html?lastdeaths=true">Last deaths</a>`;
    if(myURL.pathname == "/"){myURL.pathname = "/index.html"}
    path = myURL.pathname;
    const result = md.render(fs.readFileSync("readme.md", "utf8"));
    vals.message = result;
    serveChangedContent();
  }else{
    serveChangedContent(myURL.pathname);
  }
}
module.exports = public; 