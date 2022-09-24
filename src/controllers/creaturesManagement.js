const inGameMonsters = require("../lists/monstersList").data;
const game = require("../../public/js/gameDetails");
const Creature = require("../components/Creature");
const monstersTypes = require("../types/monstersTypes");
const npcs = require("../lists/npcs").npcs;
const disallowKeys = [
  "startPosition",
  "email",
  "password",
  "lastDeaths"
];
const im = require("./itemsController")
const wm = require("./wallsController")

const cm = { // creatures managment [monsters = monsters & npc's] 
  allMonsters: [],
  monstersInArea: [],
  loadMonsters(){
    for(const m of inGameMonsters){
      let monster;
      if(typeof m.type != "undefined"){
        monster = new Creature(m.name,this.allMonsters.length,"monster");
        // monster.type = m.type;
      }else{
        monster = new Creature(m.name,this.allMonsters.length,m.type);
        // monster.type = "monster";
      }

      for(const k of Object.keys(m)){
        monster[k] = m[k];
      }
      monster.startPosition = m.position;
      // if(typeof m.type != "undefined"){
      //   monster.type = m.type;
      // }else{
      //   monster.type = "monster";
      // }
      
      for(const sm of monstersTypes.concat(npcs)){ // single monster
        if(sm.name == m.name){
          for(const md of Object.keys(sm)){ // monster details
            monster[md] = sm[md];
          }
        }
      }
      monster.maxHealth = monster.health;
      this.allMonsters.push(monster);
    }
  },
  monstersUpdate(player, param){
     //  update only monsters in area
    this.monstersInArea = [];
    for(const c of this.allMonsters){
      if(Math.abs( c.position[0] - player.position[0] ) < 7
      && Math.abs( c.position[1] - player.position[1] ) < 7){
        this.monstersInArea.push(c);
      }
    }
    for(const c of this.monstersInArea){
      // 0 because of monsters don't upgrades skills
      // c.update(param,0,this.monstersInArea.concat(this.players.list),im,wm.list);
      c.update(param,0,this.monstersInArea.concat(this.players.list),im.allItems,wm.list);
    }
  },
  init(){
    this.loadMonsters();
  },
  async update(param,callback, dbconnected){
    // this.players.update(param,(player)=>{
    const player = await this.players.update(param, dbconnected)
      this.monstersUpdate(player, param);
      game.player = player.id;
      if(typeof player.text == "undefined"){delete player.text;}
      const filteredCreatures = [];
      for(const creature of this.players.list.concat(this.monstersInArea)){
        const filteredCreature = {};
        for(const key of Object.keys(creature)){
          if(!disallowKeys.includes(key)){
            filteredCreature[key] = creature[key];
          }
        }
        filteredCreatures.push(filteredCreature);
      }
      const output = {
        game: game,
        creatures: filteredCreatures
      }
      callback(output,player);
      // retrive died player
      if(typeof game.dead != "undefined"){
        delete game.dead;
        player.position = player.startPosition;
        player.health = player.totalHealth;
        player.mana = player.totalMana;
        player.cyle = 0;
        player.direction = 1;
        this.players.kick(player);   
      }
      player.text = "";
    // })
  },
  players: {
    list:[],
    inLoading:[],
    async init(db){
      // REFRESH PLAYER SKILLS [ONCE A SERV LOAD])
      const skipKeys = [
        "healthValue",
        "text",
        "game",
        "shotTarget",
        "bulletOnTarget",
        "cyle",
      ];
      const deleteKeys = ['healing'];
      const loginTokens = [];
      const res = await db.loadAll();
      for(const plr of res){
        // make instance of player
        const player = new Creature(plr.name,0,"player");
        // rewrite
        for(const key of Object.keys(plr)){
          // if(deleteKeys.includes(key)){console.log(key)}
          if(skipKeys.includes(key)){continue;}

          // deleting weird eq fields
          if(key == 'eq'){
            for(const eqKey of Object.keys(plr[key])){
              if(!Object.keys(player.eq).includes(eqKey)){
                console.log("DELETING: "+eqKey);
                delete plr.eq[eqKey];
              }
            }
          }

          if(plr[key].constructor === Object){
          // if it's object
            player[key] = {};
            for(const keyIn of Object.keys(plr[key])){
              if(deleteKeys.includes(keyIn)){
                console.error("deleting "+keyIn+" from "+plr.name+" "+key)
              }else{
                player[key][keyIn] = plr[key][keyIn];
              }
            }
          }else if(plr[key].constructor === Array){
          // if it's array
            player[key] = [];
            for(const keyIn of Object.keys(plr[key])){
              player[key][keyIn] = plr[key][keyIn];
            }
          }else{
            // if(key == 'speed' & player[key] != )
            player[key] = plr[key];
          }
        }
        // update player
        // player.update({name:player.name,type: 'initUpdate'},db,[],{itemsInArea:[]});
        player.update({name:player.name,type: 'initUpdate'},db,[],[]);
        // update player skills
        player.skills.level = -1;
        // player is update in db there:
        player.updateSkills(db);
      }
    },
    // async update(param){
    async update(param, dbconnected){
      // check if player is on the list (in the game), and update it
      let isPlayer = false;
      for(const p of this.list){
        // update player is playing
        if(p.name == param.name){
          isPlayer = p;
          // console.log(isPlayer)
          isPlayer.update(
            param,
            dbconnected,
            // cm.monstersInArea.concat(this.list),
            cm.allMonsters.concat(this.list),
            im.allItems,
            wm.list
          );
          // console.log('IM HERE: ', isPlayer)
          // console.log('IM HERE: ')
          return isPlayer
          // callback(isPlayer);
          // break;
        }
      }
      // push player to online list
      if(isPlayer == false && !this.inLoading.includes(param.name)){
        this.inLoading.push(param.name);
        //  make new unique id
        const ids = [];for(const creat of this.list.concat(cm.allMonsters)){ids.push(creat.id);}
        let newID = 1; while(ids.includes(newID)){newID++;}
        // get info from srv;
        const newPlayer = new Creature(param.name,newID-1,"player");
        // await dbc[game.db].load(newPlayer,(res)=>{
        // const res = await dbc[game.db].load(newPlayer)
        const res = await dbconnected.load(newPlayer)
          if(res){
            // merge it with newPlayer
            const defaultPosition = newPlayer.position;
            for(const k of Object.keys(res)){
              if(['token'].includes(k)){continue;}
              newPlayer[k] = res[k];
            }
            if(newPlayer.lastFrame < game.lastUpdate){
              newPlayer.position = defaultPosition;
            }
          }
          newPlayer.type = "player";
          this.inLoading.splice(this.inLoading.indexOf(param.name),1);     
          this.list.push(newPlayer);
          // update player loading info (token etc)
          // dbc[game.db].update(newPlayer);
          dbconnected.update(newPlayer);
          // callback(newPlayer);
          return newPlayer
        // }); 
      }
      console.log("keep going")
      // kick off offline.
      const kickTime = isPlayer.focus?1000:20000;
      // setTimeout(() => {
        // console.log('im here')
        if(typeof isPlayer == "object" 
          && new Date().getTime() - isPlayer.lastFrame > kickTime
          && this.list.includes(isPlayer)){
            cm.players.kick(isPlayer)
        }
      // }, 1000);
    },
    kick(player){
      let isThisPlayerOlnine = false;
      for(const singlePlayer of this.list){
        if(singlePlayer.name == player.name){
          isThisPlayerOlnine = true;
          break;
        }
      }
      if(isThisPlayerOlnine){
        this.list.splice(this.list.indexOf(player),1);
        dbc[game.db].update(player);
        // console.log(player.name+" KICKED")
      }
    }
  }
}
module.exports = cm