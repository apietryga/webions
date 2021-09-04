const fs = require('fs');
const game = require('./gameDetails');
const stringify = require("json-stringify-pretty-compact");
const redisJSON = {
  client : require('redis').createClient(process.env.REDIS_URL),
  getAll(callback = () => {}){
    this.client.keys("*",(e,keys)=>{
      if(keys.length == 0){callback(0)}
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
  },
  set(obj,callback = () => {}){
    const key = obj.name;
    const stringyfy = JSON.stringify(obj);
    this.client.set(key,stringyfy,()=>{
      callback();
    });
  },
  setMultiple(json, callback = () => {}){
    for(const [i,obj] of json.entries()){
      this.set(obj,()=>{
        if(i == json.length -1){callback();}
      })
    }    
  },
  get(name, callback){
    this.client.get(name, (e,c)=>{
      callback(JSON.parse(c));
    })    
  }
}
class dbConnect{
  constructor(){
    // this.redisClient = require('redis').createClient();
    this.test();
    this.src = "./json/playersList.json";
    this.dataToSave = [
      "name",
      "health",
      "maxHealth",
      "lastFrame",
      "skills",
      "speed",
      "sprite"
    ]
  }
  update(player,callback){
    // updating exsists or create new one
    let playerIsSet = false;
    // let content = this.loadContent();
    this.loadContent((content)=>{
      let playerIndex;
      const uKeys = [
        "name",
        "sprite",
        "skills",
        "position",
        "speed",
        "health",
        "maxHealth"
      ];
      for(const [i,p] of content.entries()){
        if(p.name == player.name){
          playerIsSet = true;
          playerIndex = i;
        }
      }
      if(playerIsSet){
        // update record
        const uPlayer = {};
        for(const k of Object.keys(player)){
          if(uKeys.includes(k)){
            uPlayer[k] = player[k];
          }
        }
        content[playerIndex] = uPlayer;
      }else{
        // create new record 
        const nPlayer = {};
        for(const k of Object.keys(player)){
          if(uKeys.includes(k)){
            nPlayer[k] = player[k];
          }
        }
        content.push(nPlayer);
      }
      if(game.db == "redis"){
        redisJSON.setMultiple(content);
      }
      if(game.db == "json"){
        content = stringify(content);
        fs.writeFileSync(this.src, content, ()=>{});  
      }
    })
  }
  load(player,callback){
    this.loadContent((cont) => {
      const content = cont;
      for(const p of content){
        if(p.name == player.name){
          for(const k of Object.keys(p)){
            player[k] = p[k];
          }
          break;
        }
      }
      callback(player);
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
  test(){
    process.on('uncaughtException',(err) => {
      console.log(err);
      if(typeof err == "undefined"){
        game.db == 'redis';
      }else{
        game.db = "json";
      }
    })
  }
}

module.exports = dbConnect;