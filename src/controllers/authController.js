const bcrypt = require('bcrypt');
const func = require('../../public/js/functions')
const npcs = require('../lists/npcs').npcs;
const creatures = require('../types/monstersTypes');
const monsters = creatures.filter( creature => typeof creature.type == "undefined" && creature.sprite != "tourets" )
const monstersNames = func.getNamesFromObjArr(monsters).concat(func.getNamesFromObjArr(npcs));
const Creature = require('../components/Creature')

module.exports = new class authController {
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
    comparePassword : async ( plainPass, hashword ) => {
      return await bcrypt.compare(plainPass, hashword)
    },
  }

  isAuth(){ // cookie login

    return false 
  }

  home = (req, res) => { 
    const vals = {
      action : req.url.replace("/", "")
    }
    if(req.url == '/register'){
      vals.js = `<script>let monstersNames = ${ JSON.stringify( monstersNames ) }</script>`
    }
    res.render('account.njk', vals) 
  }

  login = async ( req, res ) => {
    const data = req.body
    const currentTokens = [];
    const allPlayers = await dbconnected.loadAll();

    const dbres = allPlayers.find( player => { 
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
      message: token,
      nick: data.nick
    })
  }

  logout = (req, res) => { 
    res.render('account.njk', {
      action: 'result',
      js: "<script>delete_cookie('token')</script>",
      message : "<b style='color:green;'>You're succesfully logout.</b>"
    }) 
  }

  register = async ( req, res ) => {
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
    this.password.cryptPassword(req.body.password, async ( e, password ) => {
      if(e != null){ return console.error(e) }
      await dbconnected.update({
        ...newPlayer,
        password,
        email: req.body.email.replace("%40","@"),
        sex: req.body.sex,
      })
    })
    return res.render('account.njk', {
      action: 'result',
      message: `<b style='color:green;'> You're succesfully created your account. </b>
      <br /><a href='account.html?action=login'>Click here to login.</a>`,
    })
  }

  forgot = (req, res) => { res.render('account.njk', req.query) }

}