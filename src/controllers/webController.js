const MarkdownIt = require('markdown-it'), md = new MarkdownIt();
const fs = require('fs');
const game = require("../../public/js/gameDetails");
const itemTypes = require("../types/itemsTypes").types;
const creatures = require("../types/monstersTypes");
const npcs = require("../lists/npcs").npcs;
const func = require("../../public/js/functions");
const auth = require("./authController")
const logger = require('../config/winston')

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
    // console.log("")

    this.vals.aside = `
      <a href="/players/online">Online list</a>
      <a href="/players/lastdeaths">Last deaths</a>`;
    this.vals.message = md.render(fs.readFileSync("readme.md", "utf8"));
    this.vals.page = 'index'
    res.render("template.njk", this.vals);
  }
  
  players = async ( req, res ) => {
    const vals = {
      aside : `
      <a href="/players/level">Level</a>
      <a href="/players/fist">Fist</a>
      <a href="/players/dist">Dist</a>
      <a href="/players/def">Def</a>
      <a href="/players/magic">Magic</a>
      <a href="/players/online">Online</a>
      <a href="/players/lastdeaths">Last&nbsp;Deaths</a>`,
      monsters : this.monsters,
      page: 'players',
      players : await dbconnected.loadAll(),
      subpage: req.url == "/" ? 'index' : req.url.substring(1).split(/[$&+,:;=?@#|'<>.^*()%!-]/)[0]
    }
    for(const key in vals){ this.vals[key] = vals[key] }
    res.render("template.njk", this.vals)
  }

  libary = ( req, res ) => { 
    const vals = {
      aside : `
        <a href="/libary/install">Install</a>
        <a href="/libary/controls">Controls</a>
        <a href="/libary/monsters">Monsters</a>
        <a href="/libary/items">Items</a>
        <a href="/libary/about">About</a>`,
      items : itemTypes,
      page : 'libary',
      subpage : req.url == "/" ? 'index' : req.url.substring(1).split(/[$&+,:;=?@#|'<>.^*()%!-]/)[0],
      monsters : this.monsters
    }
    for(const key in vals){ this.vals[key] = vals[key] }
    res.render("template.njk", this.vals)
  }

  player = async ( req, res ) => {
    // console.log(req.params.player)
    this.vals.player = await dbconnected.load({ name:req.params.player })
    // console.log(this.vals.player)
    logger.player(this.vals.player.name + ' has been seen.')
    delete this.vals.player.token
    delete this.vals.player.password
    this.vals.player.type = 'player'
    func.setTotalVals(this.vals.player)

    this.vals.page = 'player'
    this.vals.aside = `
      <a href="/players/level">Level</a>
      <a href="/players/fist">Fist</a>
      <a href="/players/dist">Dist</a>
      <a href="/players/def">Def</a>
      <a href="/players/magic">Magic</a>
      <a href="/players/online">Online</a>
      <a href="/players/lastdeaths">Last&nbsp;Deaths</a>`,
    res.render("template.njk", this.vals)
  }

  ['4devs'] = (req, res) => {
    this.vals.aside = `<a href="https://github.com/apietryga/webions" target="_blank">GITHUB</a>`;
    this.vals.page = req.url.match(/([a-zA-Z0-9]+)/g)[0]
    res.render("template.njk", this.vals);
  }

  exportplayers = (req, res) => {
    this.vals.page = req.url.match(/([a-zA-Z0-9]+)/g)[0]
    res.render("template.njk", this.vals);
  }

  game = async (req, res) => {
    this.vals.monstersNames = this.monstersNames
    this.vals.page = req.url.match(/([a-zA-Z0-9]+)/g)[0]
    this.vals.message = ""
    const isAuth = await auth.isAuth( req );
    if( isAuth ){
      return res.render('game.njk', isAuth)
    }
    return res.redirect('/acc/login');
  }
}