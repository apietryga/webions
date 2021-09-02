const fs = require('fs');
const stringify = require("json-stringify-pretty-compact");
class dbConnect{
  constructor(){
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
  update(player,state = ""){
    // updating exsists or create new one
    let playerIsSet = false;
    let content = JSON.parse(this.loadContent());
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
    content = stringify(content);
    // fs.writeFile(this.src, content, ()=>{
    //   return content;
    // }); 
    fs.writeFileSync(this.src, content, ()=>{

    });

    // })
  }
  load(player){
    const content = JSON.parse(this.loadContent());
    for(const p of content){
      if(p.name == player.name){
        for(const k of Object.keys(p)){
          player[k] = p[k];
        }
        break;
      }
    }
    return player;
  }
  loadContent(){
    return fs.readFileSync(this.src, "utf8",(e,content) => {})
  }

}

module.exports = dbConnect;