const fs = require('fs');
const game = require('./gameDetails');
const stringify = require("json-stringify-pretty-compact");
const redis = require('redis');
const { on } = require('stream');
class dbConnect{
  init(callback){
    console.log("Setting database");
    // Redis connection
    if(typeof process.env.REDIS_URL == "string" || typeof process.env.REDIS_TLS_URL == "string"){
      this.client = redis.createClient(process.env.REDIS_TLS_URL ? process.env.REDIS_TLS_URL : process.env.REDIS_URL, {tls: {rejectUnauthorized: false,}});
    }else{
      this.client = redis.createClient();
    }
    this.client.once('error',(err)=>{
      this.client.quit();
      delete this.client;
      game.db = 'json';
    })
    this.client.keys('*',(error)=>{
      if(error  == null){
        game.db = 'redis';
        // redisJSON.client = this.client;
      }else{
        game.db = 'json';
      }
      callback();
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
      "position"
    ];
    this.json.dataToSave = this.dataToSave;
    this.redis.dataToSave = this.dataToSave;

    // const dbc = this;
    // var that = this;
  }
  update(player,callback){
    // updating exsists or create new one
    let playerIsSet = false;
    this.loadContent((content)=>{
      content == 0?content = []:'';
      let playerIndex;
      
      if(content.length > 0 ){
        for(const [i,p] of content.entries()){
          if(p.name == player.name){
            playerIsSet = true;
            playerIndex = i;
          }
        }  
      }
      if(playerIsSet){
        // update record
        const uPlayer = {};
        for(const k of Object.keys(player)){
          // if(uKeys.includes(k)){
          if(this.dataToSave.includes(k)){
            uPlayer[k] = player[k];
          }
        }
        content[playerIndex] = uPlayer;
      }else{
        // create new record 
        const nPlayer = {};
        for(const k of Object.keys(player)){
          if(this.dataToSave.includes(k)){
          // if(uKeys.includes(k)){
            nPlayer[k] = player[k];
          }
        }
        content.push(nPlayer);
      }
      if(game.db == "redis"){
        redisJSON.setMultiple(content,()=>{
          // callback(content);
        });
      }
      if(game.db == "json"){
        content = stringify(content);
        fs.writeFileSync(this.src, content, ()=>{
          // callback(content);
        });  
      }
    })
  }
  load(player,callback){
    this.loadContent((cont) => {
      const content = cont;
      if(content == 0){
        this.update(player,()=>{
          callback(false);
        })
      }else{
        for(const p of content){
          if(p.name == player.name){
            for(const k of Object.keys(p)){
              player[k] = p[k];
            }
            break;
          }
        }
        callback(player);
  
      }
    })
  }
  loadContent(callback){
    if(game.db == "json"){
      // return fs.readFileSync(this.src, "utf8",(e,content) => {})
      fs.readFile(this.src,"utf8",(e,content) => {
        callback(JSON.parse(content));
      })
    }
    if(game.db == "redis"){
      redisJSON.getAll((c) => {
        callback(c);
      });
    }
  }
  // db types 
  redis = {
    client : new redis.RedisClient,
    loadAll(callback){
      this.client.keys("*",(e,keys)=>{
        if(typeof keys == "undefined" || keys.length == 0){callback(0)}
        const json = [];
        for(const [i,k] of keys.entries()){
          this.client.get(k,(e,v)=>{
            if(typeof v != "undefined"){
              json.push(JSON.parse(v));
            }
            if(i == keys.length-1){
              callback(json);
            }
          })
        }
      });
      // callback("all");
    },
    load(player,callback){
      this.client.get(player.name, (e,c)=>{
        callback(JSON.parse(c));
      })    
    },
    update(player){
      this.client.get(player.name, (e,c)=>{
        const stringyfy = JSON.stringify(player);
        this.client.set(player.name,stringyfy,()=>{});
      })
    }
  }
  json = {
    src: "./json/playersList.json",
    loadAll(callback){
      fs.readFile(this.src,"utf8",(e,content) => {
        callback(JSON.parse(content));
      })
    },
    load(player,callback){
      this.playerIsSet(player.name,(p)=>{
        callback(p[0]);
      })
    },
    playerIsSet(name,callback){
      this.loadAll((r)=>{
        // find player by name
        let isPlayer = false;
        for(let p of r){
          if(p.name == name){
            isPlayer = p;
            break;
          }
        }
        callback([isPlayer,r]);
      })
    },
    update(player){
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
      })
    },
    save(newContent){
      const content = stringify(newContent);
      fs.writeFileSync(this.src, content, ()=>{});  
    }
  }
}
// change storage to json on redis crash
process.on("uncaughtException",(err)=>{
  game.db = "json";
})
module.exports = dbConnect;