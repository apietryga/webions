const bcrypt = require('bcrypt');
// import bcrypt from 'bcryptjs';
// const func = require('../../public/js/functions')
import func from '../helpers/functions';
const npcs = require('../lists/npcsList').data;
import creatures from '../types/monstersTypes';
const monsters = creatures.filter((creature: any) => typeof creature.type == "undefined" && creature.sprite != "tourets" )
// const monstersNames = func.getNamesFromObjArr(monsters).concat(func.getNamesFromObjArr(npcs));

const monstersNames = monsters.map((m:any) => m.name).concat(npcs.map((n:any) => n.name)) 
// const monstersNames = func.getNamesFromObjArr(monsters).concat(func.getNamesFromObjArr(npcs));
// import Creature from '../components/Creature';
const Creature =  require('../components/Creature');

export default new class authController {
  password = {
    cryptPassword : (password: string, callback: Function) => {
      bcrypt.genSalt(10, function(err:string, salt: string) {
        if (err){
          console.error(err);
          return callback(err);
        }
        bcrypt.hash(password, salt, function(err: string, hash: string) {
          return callback(err, hash);
        });
      });
    },
    comparePassword : async ( plainPass: string, hashword:string ) => {
      return await bcrypt.compare(plainPass, hashword)
    },
  }

  async isAuth( req: any ){ // cookie login
    if(!req.cookies?.token || req.cookies?.token == ''){ return false }

    const all = await dbconnected.loadAll()
    const player = all.filter((player:any) => player.token === req.cookies.token )[0]

    if(player){
      return {
        action : 'game',
        token: player.token,
        nick: player.name,
      }
    }

    return false 
  }

  home = (req:any, res:any) => { 
    const vals = {
      action : req.url.replace("/", ""),
      js: ''
    }
    if(req.url == '/register'){
      vals.js = `<script>let monstersNames = ${ JSON.stringify( monstersNames ) }</script>`
    }
    res.render('account.njk', vals) 
  }

  login = async ( req:any, res:any ) => {
		console.log('LOGIN')
    const data = req.body
    const currentTokens: Array<any> = [];
    const allPlayers = await dbconnected.loadAll();

    const dbres = allPlayers.find((player:any) => { 
      currentTokens.push( player.token )
      return player.name == data.nick 
    })

    if( !dbres ){ // if player is not in base at all
      return res.render("account.njk", {
        action : 'register',
        nick : data.nick, 
        message : `<b style='color:red'>Player ${ data.nick } not exsists, but you can create it:</b>`
      });
    }

    if( ! await this.password.comparePassword( data.password, dbres.password ) ){
      return res.render("account.njk", { 
        action : 'login',
        message : "<b style='color:red'>Wrong password.</b>" 
      })
    }

    let token; do {
      token = (Math.random() + 1).toString(36).substring(2);
    } while (currentTokens.includes(token));

    dbconnected.update( { ...dbres, token } )

    res.render('game.njk', {
      action : 'game',
      token,
      nick: data.nick,
    })
  }

  logout = (req:any, res:any) => { 
    res.render('account.njk', {
      action: 'result',
      js: "<script>delete_cookie('token')</script>",
      message : "<b style='color:green;'>You're succesfully logout.</b>"
    }) 
  }

  register = async ( req:any, res:any ) => {
    const vals = {
      action : 'register',
      js : `<script>let monstersNames = ${ JSON.stringify( monstersNames ) }</script>`
    }
    if( await dbconnected.load({ name: req.body.nick }) ){
      return res.render('account.njk', {
        ...vals,
        message: "<b style='color:red;'>This account arleady exsits.</b>"
      })
    }
    const validNick = func.validateNick(req.body.nick, monstersNames)
    if(!validNick[0]){ // is not valid
      return res.render('account.njk', { ...vals, message : "<b style='color:red;'>"+validNick[1]+"</b>" })
    }
    const newPlayer = new Creature(validNick[1]);
    this.password.cryptPassword(req.body.password, async ( e:string, password:string ) => {
      if(e != null){ return console.error(e) }
      // console.log('stąd4')
      await dbconnected.update({
        ...newPlayer,
        password,
        email: req.body.email.replace("%40","@"),
        sex: req.body.sex,
      })
    })
    return res.render('account.njk', {
      action: 'result',
      message: `<b style='color:green;'> You're succesfully created your account. </b><a href='account.html?action=login' class='btn'>Login</a>`,
    })
  }

  forgot = (req:any, res:any) => { res.render('account.njk', req.query) }

}