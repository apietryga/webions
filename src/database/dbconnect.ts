const fs = require('fs');
// const game = require('../../public/js/gameDetails');
const stringify = require("json-stringify-pretty-compact");
const redis = require('redis');
// const mongoose = require('mongoose');
require('dotenv').config()
// const playerModel = require('./models/playerModel')

const dataToSave = [
  "name",
  "health",
  "maxHealth",
  "lastFrame",
  "skills",
  "speed",
  "sprite",
  "position",
  "password",
  "email",
  "sex",
  "colors",
  "eq",
  "lastDeaths",
  "quests",
  "mana",
  "maxMana",
  "token",
  "redTarget",
  "autoShot",
  "autoMWDrop",
  "lastMWall"
];

class dbConnect{

  public selected_db: string
  constructor(){
    this.selected_db = 'json'
  }

  // async init(callback){
  // public redis: any
  async init(){
    if(process.env.DEV){ return 'json' }
    return 'json'

    let db = 'redis'
    // MOGNO CONNECTION (PRIMARY)
    // await mongoose // connect to db
    // .connect(process.env.MONGO_URI)
    // .then(() => { return game.db = "mongodb" })

    // .catch(() => game.db = "redis" );
    // if(game.db == 'mongodb') return 
    // REDIS CONNECTION (SECONDARY)
    // if(typeof process.env.REDIS_URL === "string" || typeof process.env.REDIS_TLS_URL === "string"){
    //   console.log('creating remote client', typeof process.env.REDIS_URL)
    // }else{
    //   console.log('creating local client')
    //   this.redis.client = redis.createClient();
    // }

    this.redis.client = redis.createClient(process.env.REDIS_TLS_URL ? process.env.REDIS_TLS_URL : process.env.REDIS_URL, { tls: { rejectUnauthorized: false }});
    try {
      await this.redis.client.connect()
    } catch (error) {
      this.redis.client.quit();
      delete this.redis.client
      db = 'json'
    }

    return db
  }

  // db types 
  public redis: any = {
    async loadAll(){
      const keys = await this.client.keys('*')
      const players = []
      for( const name of keys ){
        players.push( await this.load({ name }))
      }
      return players
    },
    async load( player:any ){
      const bPlayer = await this.client.get( player.name )
      if(!bPlayer){ return false }
      return JSON.parse( bPlayer )
    },
    async update( player:any ){
      if(!player?.name){ return false }
      const valToStore:any = {};
      for(const key of Object.keys(player)){
        if(dataToSave.includes(key)){
          valToStore[key] = player[key];
        }
      }
      const stringyfy = JSON.stringify(valToStore);
      return await this.client.set( player.name, stringyfy );
    },
    del(playerName:any){
      this.client.del(playerName);
    }
  }

  json = {
    async loadAll(){
      if(!fs.existsSync(this.src)){fs.writeFileSync(this.src,"[]")}
      const content = fs.readFileSync(this.src,"utf8");
      if(content != null){
        return JSON.parse(content);
      }
      return []
    },
    async load( player:any ){
      const p = await this.playerIsSet( player.name )
      return p[0]
    },
    async update( player:any ){
      const p = await this.playerIsSet(player.name)
        if(typeof p[0] == "object"){
          for(const k of Object.keys(player)){
            if(dataToSave.includes(k)){
              p[1][p[2]][k] = player[k];
            }
          }
        }else{
          // create new record
          const nPlayer:any = {};
          for(const k of Object.keys(player)){
            if(dataToSave.includes(k)){
              nPlayer[k] = player[k];
            }
          }
          p[1].push(nPlayer);
        }
        this.save(p[1]);
    },
    del(playerName:any){
      const allPlayers = JSON.parse(fs.readFileSync(this.src,{encoding:"utf8"}));
      for(const [i,player] of allPlayers.entries()){
        if(player.name == playerName){
          allPlayers.splice(i,1);
        }
      }
      this.save(allPlayers);
    },

    // FOR INTERNAL USAGE ONLY
    async playerIsSet( name:any ){
      const allPlayers = await JSON.parse(fs.readFileSync(this.src,{encoding:"utf8"}));
      let isPlayer, index, p;
      for([ index, p ] of allPlayers.entries()){
        if(p.name == name){
          isPlayer = p;
          break;
        }
      }
      return [isPlayer, allPlayers, index];
    },
    save(newContent:any){
      fs.writeFileSync(this.src, stringify(newContent));  
    },
    src: "./src/lists/playersList.json",
  }

  // mongodb = {
  //   loadAll(callback){
  //     console.log("mongooose loadall")
  //   },
  //   // load(player, callback){
  //   load(player){
  //     console.log("mongo load")
  //   },
  //   // update(player, callback = () => {}){
  //   update(player){
  //     console.log("mongo updating")

  //     const exsitUser = await playerModel.findOne({ email: email });
  //     if (exsitUser) {
  //       const error = new Error(
  //         "Eamil already exist, please pick another email!"
  //       );
  //       res.status(409).json({
  //         error: "Eamil already exist, please pick another email! ",
  //       });
  //       error.statusCode = 409;
  //       throw error;
  //     }

  //     const hashedPassword = await bcrypt.hash(password, 12);
  //     const user = new userModel({
  //       fullname: fullname,
  //       email: email,
  //       password: hashedPassword,
  //     });
  //     const result = await user.save();
  //     res.status(200).json({
  //       message: "User created",
  //       user: { id: result._id, email: result.email },
  //     });

  //   },
  //   save(newContent){
  //     console.log('mongo player saving')
  //   },
  //   del(playerName){
  //     console.log("mongo delete player")
  //   },
  //   import(){
  //     // import data from old redis
  //     console.log('IMPORTING')
  //     fs.readFileSync('./backups/webions_players27.08.json')
  //     console.log('IMPORTING DONE')

  //   }
  // }
}
// module.exports = dbConnect;
export default new dbConnect()