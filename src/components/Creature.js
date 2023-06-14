const GameMap = require("../../public/js/map");
const map = new GameMap();
const func = require("../../public/js/functions");
const game = require("../../public/js/gameDetails");
const Item = require("./Item");

module.exports = class Creature {
  constructor(nickName,creaturesLength = 0,type = "monster"){
    // this.creatures = require('../modules/creature')
    // this.items = require('../modules/item')
    this.id = creaturesLength+1; 
    this.name = nickName;
    this.type = type;
    this.position = [35,-9,-1];
    this.walk = false;
    this.speed = 3; // grids per second
    this.totalSpeed = this.speed;
    this.direction = 1;
    this.health = 100;
    this.maxHealth = this.health;
    this.totalHealth = this.maxHealth;
    this.redTarget = false;
    this.restore = false;
    this.sprite = "male_oriental";
    this.exhaustTime = 1000;
    this.exhaust = {
      fist: 0,
      dist : 0,
      mwall: 0,
      heal: 0,
      say: 0
    }
    if(type == "player"){
      this.skills = {
        level:1,
        exp:1,
        fist:1,
        fist_summary:1,
        dist:1,
        dist_summary:0,
        def:1,
        def_summary:1,
        magic:1,
        magic_summary:1,
      }
      this.autoShot = false;
      this.autoMWDrop = false;
      this.lastFrame = 0;
      this.lastDeaths = [];
      this.quests = [];
      this.colors = {
        head: [240, 169, 98],
        chest: [240, 98, 98],
        legs: [155, 155, 155],
        foots: [13, 13, 13]
      }
      this.eq = {
        hd:false,
        bp:false,
        nc:false,
        ch:false,
        lh:false,
        rh:false,
        lg:false,
        ft:false,
      }
      this.mana = 100;
      this.maxMana = this.mana;
      this.manaRegenValue = 0;
      this.manaRegenExhoust = 0;   
      this.startPosition = this.position;
      this.locker = {
        name: "Locker",
        in: [],
        cap: 10,
        field: 'locker'
      };
    }
    if(nickName == "GM"){
      this.sprite = "gm";
    }
    this.baseSpeed = this.speed;
		this.serverUpdating = { login: true }
  }
  // getHit = (db,from,type = 'fist') =>{
  //   if(this.type != "player" || func.isSet(this.totalDef)){
  //     let hit = from.skills[type];
  //     if(type == 'dist' && func.isSet(from.totalDist)){
  //       hit = from.totalDist;
  //     }
  //     if(type == 'fist' && func.isSet(from.totalFist)){
  //       hit = from.totalFist;
  //     }
  //     if(this.totalDef > 0){
  //       if(this.hit >= this.totalDef){
  //         this.skills.def_summary += this.totalDef;
  //       }else{
  //         this.skills.def_summary += hit;
  //       }
  //       hit -= this.totalDef;
  //       this.updateSkills(db);
  //     }
  //     // KILLING SHOT
  //     if(this.health <= hit){
  //       this.health = 0;
  //       from.redTarget = false;
  //       if(this.type == "player"){
  //         // downgrade exp
  //         this.skills.exp = Math.floor(this.skills.exp*0.95);
  //         this.updateSkills(db);
  //         this.text = "You're dropped level to "+this.skills.level;
  //         // save dead
  //         const deadLog = {
  //           when: new Date(),
  //           who: from.name,
  //           whoType : from.type,
  //           level: this.skills.level
  //         };
  //         if(func.isSet(this.lastDeaths)){
  //           if(this.lastDeaths.length >= 5){this.lastDeaths.shift()}
  //           this.lastDeaths.push(deadLog)
  //         }else{
  //           this.lastDeaths = [deadLog];
  //         }
  //       }
  //     }else{
  //       if(hit > 0){
  //         this.health -= hit;
  //         this.text = from.name+" takes u "+hit+" hp";
  //       }
  //     }
  //     // COUNT SKILLS
  //     if(['fist','dist'].includes(type) && from.type == "player" && !isNaN(hit)){
  //       // from.skills[type+'_summary']++;
  //       from.skills[type+'_summary'] = from.skills[type+'_summary'] + hit;
  //       from.updateSkills(db);
  //     }
  //     // GIVE EXP TO KILLER! 
  //     if(this.type == "monster" && this.health <= 0){
  //       from.skills.exp += this.skills.exp;
  //       from.updateSkills(db);
  //     }
  //   }
  // }
  nearbyItems( allItems ){
    return allItems.filter( it => { 
      return Math.abs(it.position[0] - this.position[0]) < Math.ceil( game.mapSize[0] / 2 ) + 1
        && Math.abs(it.position[1] - this.position[1]) < Math.ceil( game.mapSize[1] / 2 ) + 1
    })
  }
  // nearbyCreatures( allCreatures ){
	// 	// ! DONE IN gameController.js !
	// 	// ! console.log("GET RID OF THIS !!!! |nearbyCreatures|")
  //   return allCreatures.filter( cr => {
  //     return Math.abs(cr.position[0] - this.position[0]) < Math.ceil( game.mapSize[0] / 2 ) + 1
  //       && Math.abs(cr.position[1] - this.position[1]) < Math.ceil( game.mapSize[1] / 2 ) + 1
  //       && this.id != cr.id
  //   })
  // }
  manaRegen( ){
    if(!this?.totalManaRegen || this.manaRegenExhoust >= game.time.getTime() || this.totalManaRegen <= 0){ return }
    if((this.mana + this.totalManaRegen) < this.totalMana){
      this.mana += this.totalManaRegen;
    }else{
      this.mana = this.totalMana;
    }
    const manaExhoust = 1000;
    this.manaRegenExhoust = game.time.getTime()*1 + manaExhoust;
  }
  mwallDrop( param, walls ){
    if(( this.autoMWDrop || param?.mwallDrop ) && this.exhaust.mwall <= game.time.getTime() ){ 
      const mwallManaBurn = 250;
      const wallLifeTime = 15; // seconds
      const addExhaust = [ game.time.getTime() + ( wallLifeTime * 1000 ) ];
      const dropMWall = ( mwallManaBurn, addExhaust ) => {
        // check if wall is in area
        if(Math.abs(this.position[0] - this.lastMWall[0]) >= 6 || Math.abs(this.position[1] - this.lastMWall[1]) >= game.mapSize[1] / 2 || this.position[2] != this.lastMWall[2]){
          this.text = "You can't drop wall there."
          this.autoMWDrop = false;
          return 0;
        }
        // check if wall exists
        let wallExists = false;
        for(const wall of walls){
          if(func.compareTables([wall[0],wall[1],wall[2]],[this.lastMWall[0],this.lastMWall[1],this.lastMWall[2]])){
            wallExists = true;
            wall[3] = addExhaust[0];
            break;
          }
        }

        // if(func.isPos(map,this)){
        this.mana -= mwallManaBurn;
        this.lastMWall[3] = addExhaust[0];
        this.text = "Magic Wall takes "+mwallManaBurn+" mana.";
        this.skills.magic_summary += mwallManaBurn;
        // updateSkills(db);  
        // this.updateSkills(dbconnected);  
        if(!wallExists){
          walls.push(this.lastMWall)
        }

        // }else{
        //   text = "Sorry it's not possible."
        // }

      }
      if(this.mana >= mwallManaBurn){
        if(func.isSet(param.mwallDrop)){
          // mwall dropping from key
          this.lastMWall = param.mwallDrop.concat(addExhaust);
          dropMWall(mwallManaBurn,addExhaust);
        }else if(func.isSet(this.lastMWall) && this.autoMWDrop){
          dropMWall(mwallManaBurn,addExhaust);
        }else{
          this.text = "Set the wall first.";
          this.autoMWDrop = false;
        }
      }else{
        this.text = "You need "+mwallManaBurn+" mana";
      }
      this.exhaust.mwall = game.time.getTime() + this.exhaustTime;
    }





  }
  openDepoLockers( ){
    if(this.lockerOpened
      && this.position[2] == this.position[2]
      && Math.abs(this.position[0] - this.lockerOpened[0]) <= 1
      && Math.abs(this.position[1] - this.lockerOpened[1]) <= 1
    ){
    }else{
      this.lockerOpened = false;
    }  
  }
  say( param ){
    if((func.isSet(param.says) && param.says != "") && (!this.exhaust.say || this.exhaust.say <= game.time.getTime())){
      // CONSOLE FOR GM
      const places = {
        temple:[35,-9,-1],
        castle:[49,-34,1],
        wizards:[-70,11,2],
        king:[55,-21,-1],
        dragon:[135,1,0],
        barbarian:[4,-33,1],
        depo:[43,0,0],
        castlegate:[40,-23,0],
        castletower:[44,-37,4],
        blue17:[28,17,0],
      };
      let isCommand = false;
      if(this.name == "GM"){
        const command = param.says.split(" ");
        if(['!move'].includes(command[0])){
          if(func.isSet(command[1])){ 
            const dim = ["x","y","z"];
            let sign = false;
            let val = 1;
            let key = false;
            if(dim.includes(command[1].split("-")[0])){
              sign = -1;
              val = command[1].split("-")[1];
              key = command[1].split("-")[0];
            }
            if(dim.includes(command[1].split("+")[0])){
              sign = +1;
              key = command[1].split("+")[0];
              val = command[1].split("+")[0];
            }
            if(sign){
              for(const [i,d] of dim.entries()){
                if(key == d){
                  this.position[i] += (sign*val);
                }
              }
            }
            // templates
            if(Object.keys(places).includes(command[1])){
              this.position[0] = places[command[1]][0];
              this.position[1] = places[command[1]][1];
              this.position[2] = places[command[1]][2];
            }else{
              this.position[0] = command[1];
            }
          }
          if(func.isSet(command[2])){ this.position[1] = command[2];}
          if(func.isSet(command[3])){ this.position[2] = command[3];}
          isCommand = true;
        }
        if(['!health','!mana'].includes(command[0])){
          if(!isNaN(command[1])){
            this[command[0].replace('!','')] = command[1];
          }
          isCommand = true;
        }
        if(['!level','!fist','!dist',"!def","!magic"].includes(command[0])){
          isCommand = true;
          const keyToChange = command[0] == '!level' ? 'exp' : command[0].replace('!','')+"_summary";
          const value = isNaN(Math.pow(command[1],3)) ? false : Math.pow(command[1],3) ;
          if(value){
            this.skills[keyToChange] = value;
            // this.updateSkills(db);
            // this.updateSkills(dbconnected);
          }
        }
      }
      // PLAYER SAY'N
      if(this.type == "player"){
        // TP to temple
        if(param.says == "!temple" && this.type == "player"){
          this.position = [35,-9,-1];
        }else if(!isCommand){
          this.says = param.says;
        }
        // this.exhaust.say = game.time.getTime() + 1000;
        // saying to npc's
        // if(this.says == "hi"){
        //   if(!func.isSet(this.quests)){this.quests = [];}
        //   for(const c of creatures){
        //     if(c.type == "npc" && func.isSet(c.dialog) 
        //     && Math.abs(c.position[0] - this.position[0]) < 6
        //     && Math.abs(c.position[1] - this.position[1]) < 6
        //     && c.position[2] == this.position[2]){
        //       // c.dialog(this,c);
        //     }
        //   }
        // }  
      }
      // NPC SAY'N
      if(this.type == "npc"){
        // this.says = "elo"; 
        // this.exhaust.say = game.time.getTime() + 1000;

        // if(func.isSet(this.says)){
        // this.says = param.says;
        // if()
        // for(const dialog of this.dial){
        //   for(const speakKey of Object.keys(dialog)){
        //     if(param.says.toLowerCase() == speakKey){
        //       let text = dialog[speakKey];
        //       text.replace("{name}",param.name);
        //       // this.says = text;
        //       // this.dialog(this,player)
        //       this.talking = game.time.getTime() + 8000;
        //     }
        //   }
        // }
        // this.says = 

        // if(func.isSet(this.says)){
        //   this.talking = game.time.getTime() + 10000;
        // }
        
      }
      this.exhaust.say = game.time.getTime() + 1000;
    }
    // clear says
    (this.says == this.oldSays) ? delete this.says : this.oldSays = this.says;
  }
  // updateSkills(db, keys = ['fist','dist','def','magic']){
  //   let smthChanged = false;
  //   // fist, dist update
  //   for(const key of keys){
  //     if(!func.isSet(this.skills[key+"_summary"])){this.skills[key+"_summary"] = 0;}
  //     // const newValue = Math.ceil(Math.sqrt(this.skills[key+"_summary"]));
  //     const newValue = Math.ceil(Math.cbrt(this.skills[key+"_summary"]));
  //     if(this.skills[key] != newValue && newValue != null && !isNaN(newValue) ){
  //       this.skills[key] = newValue;
  //       smthChanged = true;
  //     } 
  //   }
  //   // level update
  //   if(this.skills.level != Math.ceil(Math.cbrt(this.skills.exp))){
  //     this.skills.level = Math.ceil(Math.cbrt(this.skills.exp));
  //     this.speed = 2 + Math.floor(this.skills.level/10)/10;
  //     this.maxHealth = 100 + Math.floor(this.skills.level*10);
  //     this.maxMana = 100 + Math.floor(this.skills.level*10);
  //     smthChanged = true;
  //   }
  //   // IF CHANGES - SAVE TO DB
  //   if(smthChanged && func.isSet(db.update)){
  //     db.update(this);
  //   }
  // }
  updateSprites( param ){
    if(!func.isSet(this.sprite)){this.sprite = this.sex+"_citizen";}
    if(func.isSet(param.outfit)){
      this.sprite = param.outfit.sprite;
      this.colors = param.outfit.colors;
      this.outfitUpdate = true;
    }else{
      delete this.outfitUpdate;
    }
  }
  update(param, allCreatures,allItems, walls = []){
  // update(param,db,allCreatures,allItems, walls = []){
		game.time = new Date()
		// free update first time
		this.serverUpdating = this.serverUpdating.login ? { login: false } : {}
		// this.serverUpdating = {}
		// if(this.serverUpdating.loading){
		// 	this.serverUpdating.loading = false
		// }else{
		// 	this.serverUpdating = {}
		// }
    // const creatures = this.nearbyCreatures( allCreatures )
    const creatures = []
    const items = this.nearbyItems( allItems )
    // set focus
    this.focus = param.focus;
    // update automation
    if(param?.autoShot && this.type == "player"){this.autoShot = param.autoShot;}
    if(param?.autoMWDrop && this.type == "player"){this.autoMWDrop = param.autoMWDrop;}
    // clear console
    if(this?.console){delete this.console;}
    if(this.type == "player"){
      this.openDepoLockers()
      this.mwallDrop( param, walls )
      this.manaRegen( )
      func.setTotalVals(this);
      if(this.health > this.totalHealth){ this.health = this.totalHealth  }
      if(this.mana > this.totalMana){ this.mana = this.totalMana }
      this.updateSprites( param )
    }
    if(['player', 'npc'].includes(this.type)){
      this.say( param )
    }
    // UPDATE LASTFRAME || KEEP PLAYER IN GAME || save player on logout
    if(typeof game.startServerTime != "undefined" && param.type != 'initUpdate'){
      this.lastFrame = game.time.getTime();
    }
    // monsters and npc's speed update
    if(["monster","npc"].includes(this.type)){
      if(func.isSet(this.speed) && this.speed != 0){
        this.totalSpeed = this.speed;
        this.baseSpeed = this.speed;
      }else{
        this.totalSpeed = this.baseSpeed;
      }
    }
    // PLAYER TO TARGET [THE NEAREST - 4 monster walking and targeting]
    let playerInArea, isPlayerNear = false; if(this.type == "monster"){
      const avaliblePlayers = [];
      for(const c of creatures){
        if(c.type == "player"){
          // add z position
          if(Math.abs(this.position[0] - c.position[0]) < Math.ceil( game.mapSize[0] / 2 ) + 2
            && Math.abs(this.position[1] - c.position[1]) < Math.ceil( game.mapSize[1] / 2 ) + 2
            && this.position[2] == c.position[2]){
              isPlayerNear = true;
              const rating = Math.abs(this.position[0] - c.position[0]) + Math.abs(this.position[1] - c.position[1]);
              avaliblePlayers.push([c,rating])
          }
        }
      } 
      avaliblePlayers.sort((a,b)=>{
        if(a[1] < b[1]){return -1;}
        if(a[1] > b[1]){return 1;}
      })
      if(avaliblePlayers.length > 0){
        playerInArea = avaliblePlayers[0][0];
      }
    }
    // WALKING
    if(this.walk <= game.time.getTime() && this.health > 0 && this.speed !== false){
      let phantomPos = [this.position[0], this.position[1], this.position[2]];
      // player walking from pushed keys
      let key;if(this.type == "player"){
        // get clicked key
        if(typeof param.controls != "undefined" && param.controls.length > 0){
          // get some of arrow key
          for(const k of [37,39,38,40]){
            if(param.controls.includes(k)){
              key = k;
              break;
            }
          }
        }
        // set probably future position
        switch (key) {
          case 39: phantomPos[0]++;this.direction = 2; break; // right key
          case 37: phantomPos[0]--;this.direction = 3; break; // left key
          case 38: phantomPos[1]--;this.direction = 0; break; // up key
          case 40: phantomPos[1]++;this.direction = 1; break; // down key
        }
      }
      let r;  // direction of move
      // monsters & npc's walking
      if(["monster","npc"].includes(this.type)){
        // set walking type (random / follow / escape)
        let walkingMode = "random";
        // walking modes
        if(this.type == "npc"){
          if(func.isSet(this.talking)){
            walkingMode = "stay";
          }else{
            walkingMode = "random";
          }
        }else{
          if(isPlayerNear){
            if(this.health > 0.2*this.maxHealth && playerInArea.health > 0){
              walkingMode = "follow";
            }else{
              walkingMode = "escape";
            }
          }  
        }
        // move monster
        if(walkingMode == "follow"){
          if(Math.abs(this.position[0] - playerInArea.position[0]) > 1
          || Math.abs(this.position[1] - playerInArea.position[1]) > 1){
            const routeFinded = func.setRoute(this.position,playerInArea.position,map,creatures,200,walls);
            if(routeFinded){
              phantomPos[0] = routeFinded[0][0];
              phantomPos[1] = routeFinded[0][1];  
            }else{
              walkingMode = "random";
            }
          }
        }
        if(walkingMode == "escape"){
          let [monX,monY] = this.position;
          let [plaX,plaY] = playerInArea.position; 
          let posibilites = [];
          if(monX <= plaX){posibilites.push(3);}
          if(monX >= plaX){posibilites.push(1);}
          if(monY >= plaY){posibilites.push(2);}
          if(monY <= plaY){posibilites.push(0);}      
          let posibilitesId = Math.round(Math.random()*(posibilites.length-1));
          r = posibilites[posibilitesId];

          if(this.escapeStuck){
            walkingMode = "random";
          }
          this.escapeStuck = true;
        }
        if(walkingMode == "random") {
          r = Math.floor(Math.random() * 4);
        }
        if(walkingMode == "stay"){
          r = -1;
        }
        if (r == 0) {phantomPos[1]--;} // up
        if (r == 1) {phantomPos[0]++;} // right
        if (r == 2) {phantomPos[1]++;} // down
        if (r == 3) {phantomPos[0]--;} // left
        // r == -1 -> stop, but wait this time
        // setting monster direction
        if(phantomPos[0] > this.position[0]){this.direction = 2;}        
        if(phantomPos[0] < this.position[0]){this.direction = 3;}        
        if(phantomPos[1] > this.position[1]){this.direction = 1;}        
        if(phantomPos[1] < this.position[1]){this.direction = 0;}
      }

      // CHEKCKING IF POSITION IS AVAILBLE
      let isFloor = false;
      let isStairs = false;
      let doorAvalible = true;
      let isWall = false;

      // check grids 
      const avalibleGrids = func.equalArr(map.avalibleGrids);
      const notAvalibleGrids = func.equalArr(map.notAvalibleGrids);
      if(this.type == "player" && !avalibleGrids.includes("stairs")){
        avalibleGrids.push("stairs");
        notAvalibleGrids.splice(notAvalibleGrids.indexOf("stairs"),1);
      }else if(this.type != "player" && avalibleGrids.includes("stairs")){
        notAvalibleGrids.push("stairs");
      }
      // ladder 
      if(this.type == "player"){
        for(const item of items){
          // up
          if(func.compareTables(item.position,this.position) && item.name == "Ladder"){
            // check if's floor between
            let isBetween = false;
            for(const grid of map.getGrid([phantomPos[0],phantomPos[1],phantomPos[2]+1])){
                isBetween = true;
            }
            // check if grid next to is avalible
            let isNextAvalible = false;
            for(const grid of map.getGrid([phantomPos[0],phantomPos[1],phantomPos[2]])){
              if(grid[4] == "floors"){
                if(grid[4] == "floors"){
                  isNextAvalible = true;
                }
              }
            }
            if(!isBetween){
              let isNextAvalible = false;
              // check future position
              for(const grid of map.getGrid([phantomPos[0]-1,phantomPos[1]-1,phantomPos[2]+1])){
                if(grid[4] == "floors"){
                  isNextAvalible = true;
                }
              }
              if(isNextAvalible){
                phantomPos[0]--;
                phantomPos[1]--;
                phantomPos[2]++;
              }
            }
          }
          // down
          if(func.compareTables([item.position[0]-1,item.position[1]-1,item.position[2]+1],phantomPos)
          && item.name == "Ladder"){
            // check if's floor between
            let isBetween = false;
            for(const grid of map.getGrid(phantomPos)){
              // if(grid[4] == "floors"){
                isBetween = true;
              // }
            }
            if(!isBetween){
              phantomPos[0]++;
              phantomPos[1]++;
              phantomPos[2]--;  
            }

          }
        }
      }
      // mwall's
      for(const wall of walls){
        if(func.compareTables(
          [wall[0],wall[1],wall[2]],
          phantomPos
        )){
          isWall = true;
          // isFloor = true;
        }
      }
      // check grids 
      for(const checkGrid of map.getGrid(phantomPos)){
        // for(const checkGrid of map.getGrid(phantomPos)){
          if(checkGrid){
            if(avalibleGrids.includes(checkGrid[4])){
              isFloor = true;
            }
            if(notAvalibleGrids.includes(checkGrid[4])){
              isWall = true;
            }
            if(checkGrid[4] == "stairs"){
              if(["monster","npc"].includes(this.type)){isFloor = false;}
              if(this.type == "player"){
                isStairs = true;
                phantomPos = checkGrid[5];
              }
            }
            if(checkGrid[4] == "doors"){
              doorAvalible = false;
              if(["monster","npc"].includes(this.type)){isFloor = false;}
              // cases when player can pass through
              if(this.type == "player" && func.isSet(checkGrid[5])){
                // level gate
                if(Object.keys(checkGrid[5]).includes("level")){
                  if(this.skills.level >= checkGrid[5].level){
                    doorAvalible = true;
                  }else{
                    this.text = "You need "+checkGrid[5].level+" level to open this doors.";
                  }
                }
                // property gate
                if(Object.keys(checkGrid[5]).includes("property")){
                  if(!isNaN(checkGrid[5].property)){
                    this.text = "This house costs "+checkGrid[5].property+" gold.";
                  }else{
                    if(checkGrid[5].property == this.name){
                      doorAvalible = true;
                    }else{
                      this.text = checkGrid[5].property+" is the owner of this house";
                    }
                  }
                }              
              }
            }
          }
      }

      if(isWall){isFloor = false;}
      if(!doorAvalible){isFloor = false;}

      // check items can't walk and walkon
      let isItem = false;
      let itemText = false;
      for(const i of items){
        if(func.compareTables(phantomPos,i.position)){
          if(func.isSet(i.walkThrow) && i.walkThrow == false){
            isItem = true;
          }
          if(func.isSet(i.walkOn)){
            itemText = true;
            i.walkOn(this,i,{allItems:allItems});
          }
        }
      }
      if(isItem){isFloor = false;}

      // monsters & npc's staying
      if(!isFloor && ["npc","monster"].includes(this.type)){
        // set exhaust
        this.walk = game.time.getTime() + Math.round(1000/this.totalSpeed);
        this.speed = 0;
      }else if(["npc","monster"].includes(this.type)){
        this.speed = this.totalSpeed;
      }

      // check monsters and players on position
      for(const c of creatures){
        if ((func.compareTables(c.position, phantomPos) && c.health > 0) 
            && ((this.type != "player" && isStairs)
            ||(this.id != c.id))){
          isFloor = false;
        }else if(
          // when there's other creature on stairs - go on
          ["npc","player","monster"].includes(c.type) && isStairs
        ){
          isFloor = true;
          break;
        }
      }

			// console.log({ param })
			// set new position or display error
      if(isFloor && ((this.type == "player" && typeof key != "undefined") 
        || (["monster","npc"].includes(this.type) && !func.compareTables(this.position,phantomPos)) )){
				// console.log("EE")
				this.serverUpdating.walk = {
					time_start: game.time.getTime(),
					time_end: game.time.getTime() + Math.round(1000/this.totalSpeed),
					position_start: this.position,
					position_end: phantomPos,
				}		

					// for monsters
          delete this.escapeStuck;
          // set exhaust
          this.walk = game.time.getTime() + Math.round(1000/this.totalSpeed);
          this.position = phantomPos;
      }else if(this.type == "player" && typeof key != "undefined" && doorAvalible && !itemText){
        this.text = "There's no way.";
      }
    }
    // RED TARGETING [monsters] 
    if(this.type == "monster" && typeof playerInArea != "undefined"){
      this.redTarget = playerInArea.id;
    }
    // RED TARGETING [player]
    if(this.type == "player" && func.isSet(param.target)){
      if(param.target == "clear"){
        this.redTarget = false;
      }else{
        this.redTarget = param.target;
      }
    }
    // CLEAR redTarget
    if(this.redTarget){
      for(const c of creatures){
        if(c.id == this.redTarget){
          if(
            c.position[2] != this.position[2]
            || Math.abs(c.position[0] - this.position[0]) > Math.floor( game.mapSize[0] / 2 )
            || Math.abs(c.position[1] - this.position[1]) > Math.floor( game.mapSize[1] / 2 )
          ){
            this.redTarget = false;
            this.text = "Target lost.";
          }
        }
      }
    }
    // DYING
    if(this.health <= 0 && !this.restore){
      this.direction = 4;
      this.cyle = 0;
      this.dieTime = game.time.getTime();
      // for monsters
      if(this.type == "monster"){
        this.restore = game.time.getTime() + 60000;
        // LOOTING
        if(func.isSet(this.loot)){
          // SET LOOTING POSITION
          const lootPositions = [];
          lootPositions.push([this.position[0]-1,this.position[1]-1,this.position[2]])
          lootPositions.push([this.position[0]-1,this.position[1],this.position[2]])
          lootPositions.push([this.position[0]-1,this.position[1]+1,this.position[2]])
          lootPositions.push([this.position[0]+1,this.position[1]+1,this.position[2]])
          lootPositions.push([this.position[0]+1,this.position[1]-1,this.position[2]])
          lootPositions.push([this.position[0]+1,this.position[1],this.position[2]])
          lootPositions.push([this.position[0],this.position[1]+1,this.position[2]])
          lootPositions.push([this.position[0],this.position[1]-1,this.position[2]])

          // SET LOOTING ITEMS BY FREQURENCY
          const currentLoot = [];
          for(const lootItem of this.loot){
            if(func.randomIntFromInterval(0, 10)/10 <= lootItem.freq){
              // set drop position of item
              const posIndex = func.randomIntFromInterval(0, lootPositions.length-1);
              lootItem.position = lootPositions[posIndex];
              lootPositions.splice(posIndex, 1);
              // add it to current loot
              currentLoot.push(lootItem)
            }            
          }
          //  ADD ITEMS TO MAP
          for(const oldMapItem of currentLoot){
            // rewrite item
            const mapItem = {};
            for(const key of Object.keys(oldMapItem)){
              mapItem[key] = oldMapItem[key];
            }  

            // unset not used vals
            delete mapItem.freq;
            // randomize amount
            if(func.isSet(mapItem.amount)){
              const [from,to] = mapItem.amount.split("-");
              mapItem.amount = func.randomIntFromInterval(from*1, to*1);
            }

            allItems.push(new Item(mapItem));
          }
        }
      }
      if(this.type == "npc"){
        this.restore = game.time.getTime();
      }
      if(this.name == param.name){
        this.direction = 4;
        game.dead = true;
      }
    }
    // RESTORING [monster, npc]
    if(["monster","npc"].includes(this.type)){
      if(this.restore && game.time.getTime() >= this.restore){
        if(func.isSet(this.dieTime)){ delete this.dieTime; }
        this.health = this.maxHealth;
        this.restore = false;
        this.direction = 1;
        if(!this.type == "npc"){
          this.position = this.startPosition;
          this.cyle = this.defaultCyle;
        }
      }else if(this.restore){
        const totalDieTime = this.restore*1 - this.dieTime*1;
        const currentDieTime =  this.restore*1 - game.time.getTime()*1;
        if((totalDieTime/3) >= currentDieTime){
          this.cyle = 2;
        }else if((totalDieTime/3)*2 >= currentDieTime){
           this.cyle = 1;
        }
      } 
    }
    // HEALING [player]
    if(typeof param.controls != "undefined" && param.controls.includes(72) && this.type=="player" && this.exhaust.heal <= game.time.getTime()  && this.health > 0){  
      // 72 is "H" key
      const healValue = Math.floor((this.totalHealth/10) + (this.skills.magic)*1);
      // const healValue = Math.floor(this.totalHealth/10);
      const manaSpend = 50;
      if(this.mana >= manaSpend && this.health < this.totalHealth){
        if(this.health*1 + healValue*1 >= this.totalHealth){
          this.health = this.totalHealth;
        }else{
          this.health = this.health*1 + healValue*1;
        }
        this.mana -= manaSpend; 
        this.skills.magic_summary = this.skills.magic_summary*1 + healValue*1;
        // this.updateSkills(db);
      }else{
        if(this.mana < manaSpend){
          this.text = "You have no mana.";
        }else{
          this.text = "You're full of health";
        }
      }
      this.exhaust.heal =  game.time.getTime() + this.exhaustTime;
    }
    // HEALING [monster]
    if(this.type == "monster" && func.isSet(this.skills.healing) && this.skills.healing > 0 && this.exhaust.heal <= game.time.getTime() && this.health > 0){
      if(this.health + this.skills.healing > this.maxHealth){
        this.health = this.maxHealth;
      }else{
        if(!func.isSet(this.skills.healing)){this.skills.healing = 100;}
        this.health += this.skills.healing;
      }
      this.exhaust.heal =  game.time.getTime() + this.exhaustTime;
    }
    // SHOTS
    if(this.redTarget){
      for(const c of creatures){
        // attack
        if(c.id == this.redTarget && this.id != c.id && c.health > 0 && this.health > 0){
          // FIST FIGHTING
          if(this.skills.fist > 0 && this.exhaust.fist <= game.time.getTime() && c.position[2] == this.position[2] &&Math.abs(c.position[1] - this.position[1]) <= 1 &&Math.abs(c.position[0] - this.position[0]) <= 1 ){
            this.exhaust.fist = game.time.getTime() + 1000;
            // c.getHit(db,this);
          }
          // DISTANCE SHOT - 68 is "D" key [players]
          if(((this.type == "player" && this.exhaust.dist <= game.time.getTime() && ((func.isSet(this.autoShot) && this.autoShot) || param.controls.includes(68))) 
            || (this.type == "monster" && this.skills.dist > 0 && this.exhaust.dist <= game.time.getTime()))){
            // check bulletTrace
            const traces = {x : [], y : []};
            // X POSITION
            const xTrace = [];
            const mX = (c.position[0]>this.position[0]) ? 1 : -1;
            for(let i = 0; i <= Math.abs(c.position[0]-this.position[0]); i++){
              const currX = this.position[0] + (i*mX);
              xTrace.push(currX);
              traces.x.push(currX);
            }
            // Y POSITION
            const yTrace = [];
            const mY = (c.position[1]>this.position[1]) ? 1 : -1;
            for(let i = 0; i <= Math.abs(c.position[1]-this.position[1]); i++){
              const currY = this.position[1] + (i*mY);
              yTrace.push(currY);
              traces.y.push(currY);
            }
            // COMBINE TRACES
            const trace = [];
            const lT = (traces.x.length > traces.y.length)?'x':'y'; //longer trace
            const sT = (traces.x.length <= traces.y.length)?'x':'y'; // shorter trace
            for(let li = 0; li < traces[lT].length; li++){
              const si = Math.floor(li*(traces[sT].length/traces[lT].length));
              if(lT == "x"){
                trace.push([traces[lT][li], traces[sT][si]])
              }else{
                trace.push([traces[sT][si],traces[lT][li]])
              }
            }
            // CHECK WALLS ON TRACE
            let isWall = false;
            for(const p of trace){
              // map's walls
              for(const g of map.getGrid([p[0],p[1],this.position[2]])){
                if(g[4] == "walls"){
                  isWall = true;
                  break;
                }
              }
              // mwall's
              for(const wall of walls){
                if(func.compareTables([wall[0],wall[1],wall[2]],[p[0],p[1],this.position[2]])){
                  isWall = true;
                  break;
                }
              }
            }
            // SHOT IF THERE'S NO WALL
            if(!isWall){
              this.shotTarget = c.id;
              this.exhaust.dist = game.time.getTime() + this.exhaustTime;
              this.bulletOnTarget = game.time.getTime()+300;
              // setTimeout(() => { c.getHit(db,this,'dist'); }, 300);
            }
          }
        }
      }
    }
    // ITEM DROPING AND PICK UPING
    if(param.itemAction){
      // create item from it's position in eq
      let phantomItem = false;
        if(param.itemAction.actionType == 'drop' && func.isSet(param.itemAction.field) && param.itemAction.field != ''){
          phantomItem = this.eq[param.itemAction.field.split(",")[0]];
          if(param.itemAction.field.includes(",")){
            // GET ITEM FROM CAPABLE BP
            for(let inLevel = 0; inLevel < param.itemAction.field.split(",").length; inLevel++){
              if(inLevel){
                phantomItem = phantomItem.in[param.itemAction.field.split(",")[inLevel]];
                // phantomItem.visibleFloor = param.itemAction.visibleFloor;
              }
            }         
          }
          if(phantomItem){
            phantomItem.position = param.itemAction.position;
            phantomItem.actionType = 'drop';
            // if(!isSet(phantomItem.field)){
              phantomItem.field = param.itemAction.field;
            // }
          }
        }else if(param.itemAction.actionType == 'pickUp'){
          for(const item of items.reverse()){
            if(func.compareTables(item.position, param.itemAction.position )){
              phantomItem = item;
              break;
            }
          }

        }
      if(phantomItem){
        phantomItem.visibleFloor = param.itemAction.visibleFloor;
        const item = new Item(phantomItem);
        item.relocate(this,{allItems: allItems},param.itemAction)
      }else{
        this.text = "Sorry, this action is not possible."
      }
      delete param.itemAction; 
    }
  }
}

