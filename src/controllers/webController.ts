const MarkdownIt = require('markdown-it'), md = new MarkdownIt();
import fs from 'fs';
// import { dirname, join } from 'path';
// import game from "../../public/js/gameDetails";
const game = require("../../public/js/gameDetails");
const itemTypes = require("../types/itemsTypes").types;
import creatures from "../types/monstersTypes";
const npcs = require("../lists/npcsList").data;
// import func from "../../public/js/functions";
import func from '../helpers/functions'
import auth from "./authController";
import logger from '../config/winston/index';

// import GameMap from "../../public/js/map";
// const map = new GameMap();

// const sass = require('sass');

// console.log(__dirname)
// const scssFilename = join(dirname(require.main.filename),'../public/style/account.scss')
// console.log({ scssFilename })
// const result = sass.compile(scssFilename);
// console.log({ result })

export default new class webController {
// module.exports = new class webController {
  public vals: any
  public monsters: Array<any>
  public monstersNames: Array<string>

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
      // if(typeof creature.type == "undefined" && creature.sprite != "tourets"){
        // monsters.push(creature);
        this.monsters.push(creature);
      // }
    }
    const monsterNames = this.monsters.map((item: any) => item.name )
    const npcsNames = npcs.map((item: any) => item.name )

    // this.monstersNames = func.getNamesFromObjArr(this.monsters).concat(func.getNamesFromObjArr(npcs));
    this.monstersNames = monsterNames.concat(npcsNames);
  }

  index = (req:any, res:any) => {
    // console.log("")

    this.vals.aside = `
      <a href="/players/online">Online list</a>
      <a href="/players/lastdeaths">Last deaths</a>`;
    this.vals.message = md.render(fs.readFileSync("readme.md", "utf8"));
    this.vals.page = 'index'
    res.render("template.njk", this.vals);
  }
  
  players = async ( req:any, res:any ) => {
    const vals:any = {
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
      // players : [],
      subpage: req.url == "/" ? 'index' : req.url.substring(1).split(/[$&+,:;=?@#|'<>.^*()%!-]/)[0]
    }
    for(const key in vals){ this.vals[key] = vals[key] }
    res.render("template.njk", this.vals)
  }

  libary = ( req:any, res:any ) => { 
    const vals:any = {
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

  player = async ( req:any, res:any ) => {
    // console.log(req.params.player)
    this.vals.player = await dbconnected.load({ name:req.params.player })
    // console.log(this.vals.player)
    logger.player(this.vals.player?.name + ' has been seen.')
    delete this.vals.player.token
    delete this.vals.player.password
    this.vals.player.type = 'player'
    // func.setTotalVals(this.vals.player)
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

  ['4devs'] = (req:any, res:any) => {
    this.vals.aside = `<a href="https://github.com/apietryga/webions" target="_blank">GITHUB</a>`;
    this.vals.page = req.url.match(/([a-zA-Z0-9]+)/g)[0]
    res.render("template.njk", this.vals);
  }

  exportplayers = (req:any, res:any) => {
    this.vals.page = req.url.match(/([a-zA-Z0-9]+)/g)[0]
    res.render("template.njk", this.vals);
  }

  game = async (req:any, res:any) => {
    this.vals.monstersNames = this.monstersNames
    this.vals.page = req.url.match(/([a-zA-Z0-9]+)/g)[0]
    this.vals.message = ""
    const isAuth = await auth.isAuth( req );
    if( isAuth ){
      return res.render('game.njk', isAuth)
    }
    return res.redirect('/acc/login');
  }

	// gameMap = (req, res) => {

	// 	const mapRead = fs.readFileSync(map.path,{encoding:'utf8'});
	// 	const mapArr = JSON.parse(mapRead);
	// 	return res.json(mapArr)

	// }
	
}