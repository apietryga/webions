const fs = require('fs');
const game = require('../../public/js/gameDetails');
const stringify = require("json-stringify-pretty-compact");
const redis = require('redis');
// const mongoose = require('mongoose');
require('dotenv').config()
const playerModel = require('./models/playerModel')

class dbConnect{
  // async init(callback){
  async init(){
    // MOGNO CONNECTION (PRIMARY)
    // await mongoose // connect to db
    // .connect(process.env.MONGO_URI)
    // .then(() => { return game.db = "mongodb" })
    // .catch(() => game.db = "redis" );
    // if(game.db == 'mongodb') return 

    // REDIS CONNECTION (SECONDARY)
    if(typeof process.env.REDIS_URL == "string" || typeof process.env.REDIS_TLS_URL == "string"){
      this.redis.client = redis.createClient(process.env.REDIS_TLS_URL ? process.env.REDIS_TLS_URL : process.env.REDIS_URL, {tls: {rejectUnauthorized: false,}});
    }else{
      this.redis.client = redis.createClient();
    }
    // await this.redis.client.on('error', () => {
    this.redis.client.on('error', () => {
      this.redis.client.quit();
      delete this.redis.client;
      game.db = 'json';
    })
    // await this.redis.client.keys('*', error => {
    this.redis.client.keys('*', error => {
      if(error  == null){
        game.db = 'redis';
      }else{
        game.db = 'json';
      }
      return
    })
  }
  constructor(){
    this.src = "./json/playersList.json";
    this.dataToSave = [
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
    this.json.dataToSave = this.dataToSave;
    this.redis.dataToSave = this.dataToSave;
    // this.mongodb.dataToSave = this.dataToSave;
    // return this.init()
  }
  // db types 
  redis = {
    // loadAll(callback){
    loadAll(){
      this.client.keys("*",(e,keys)=>{
        // if(typeof keys == "undefined" || keys.length == 0){callback(0) || e != null}
        if(typeof keys == "undefined" || keys.length == 0){return 0 || e != null}
        const json = [];
        for(const [i,k] of keys.entries()){
          this.client.get(k,(e,v)=>{
            if(typeof v != "undefined"){
              json.push(JSON.parse(v));
            }
            if(i == keys.length-1){
              // callback(json);
              return json;
            }
          })
        }
      });
      // callback("all");
      return "all"
    },
    // load(player,callback){
    load( player ){
      this.client.get(player.name, (e,c)=>{
        // callback(JSON.parse(c));
         return JSON.parse(c);
      })    
    },
    // update(player,callback = ()=>{}){
    update( player ){
      if(typeof this.client != "undefined"){
        this.client.get(player.name, (e,c)=>{
          // filter vals
          const valToStore = {};
          for(const key of Object.keys(player)){
            if(this.dataToSave.includes(key)){
              valToStore[key] = player[key];
            }
          }
          // save filtered vals
          const stringyfy = JSON.stringify(valToStore);
          // this.client.set(player.name,stringyfy,()=>{callback()});
          this.client?.set(player.name,stringyfy,()=>{ return });
        })  
      }else{
        console.error("Player "+player.name+" not updated.");
        // callback();
        return
      }
    },
    del(playerName){
      this.client.del(playerName);
    }
  }
  json = {
    src: "./src/lists/playersList.json",
    async loadAll(){
      // fs.readFile(this.src,"utf8",(e, content) => {
      //   if(e == null){
      //     return await JSON.parse(content);
      //   }
      //   return []
      // })
      const content = fs.readFileSync(this.src,"utf8");
      // console.log('content', content)
      if(content != null){
        return JSON.parse(content);
      }
      // console.log("content from db", content)
      return []
    },
    // load(player,callback){
    load( player ){
      this.playerIsSet(player.name,(p)=>{
        // callback(p[0]);
        return p[0];
      })
    },
    // playerIsSet(name,callback){
    playerIsSet( name ){
      const r = JSON.parse(fs.readFileSync(this.src,{encoding:"utf8"}));
      // this.loadAll((r)=>{
        // find player by name
        let isPlayer = false;
        for(let p of r){
          if(p.name == name){
            isPlayer = p;
            break;
          }
        }
        // callback([isPlayer,r]);
        return [isPlayer,r];
      // })
    },
    // update(player,callback = ()=>{}){
    update( player ){
      this.playerIsSet(player.name,(p)=>{
        if(typeof p[0] == "object"){
          // update record
          for(let [i,px] of p[1].entries()){
            if(px.name == player.name){
              for(const k of Object.keys(player)){
                if(this.dataToSave.includes(k)){
                  p[1][i][k] = player[k];
                }
              }
              break;
            }
          }
        }else{
          // create new record
          const nPlayer = {};
          for(const k of Object.keys(player)){
            if(this.dataToSave.includes(k)){
              nPlayer[k] = player[k];
            }
          }
          p[1].push(nPlayer);
        }
        this.save(p[1]);
        // callback();
        return
      })
    },
    save(newContent){
      fs.writeFileSync(this.src, stringify(newContent));  
    },
    del(playerName){
      const allPlayers = JSON.parse(fs.readFileSync(this.src,{encoding:"utf8"}));
      for(const [i,player] of allPlayers.entries()){
        if(player.name == playerName){
          allPlayers.splice(i,1);
        }
      }
      this.save(allPlayers);
    }
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
module.exports = dbConnect;