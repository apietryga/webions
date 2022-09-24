const MarkdownIt = require('markdown-it'), md = new MarkdownIt();
const fs = require('fs');
const game = require("../../public/js/gameDetails");
const itemTypes = require("../types/itemsTypes").types;
const creatures = require("../types/monstersTypes");
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
    const monsters = [];
    for(const creature of creatures){
      if(typeof creature.type == "undefined" && creature.sprite != "tourets"){
        monsters.push(creature);
      }
    }
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
    this.vals.monsters = monsters
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
    this.vals.js += "<script>const monstersNames = "+JSON.stringify(monstersNames)+"</script>";
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
    res.render("template.njk", this.vals);
  }
  account = (req, res) => {
    this.vals.page = req.url.match(/([a-zA-Z0-9]+)/g)[0]
    res.render("template.njk", this.vals);
  }
  
}