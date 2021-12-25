const Map = require("../public/js/map");
const map = new Map();
const func = require("../public/js/functions");
const game = require("../public/js/gameDetails");
const itemsTypes = require("./itemsTypes").types;
class Creature {
  constructor(nickName,creaturesLength = 0,type = "monster"){
    this.id = creaturesLength+1; 
    this.name = nickName;
    this.type = type;
    this.position = [35,-9,-1];
    this.walk = false;
    this.speed = 2; // grids per second
    this.totalSpeed = this.speed;
    this.direction = 1;
    this.health = 100;
    this.maxHealth = this.health;
    this.totalHealth = this.maxHealth;
    this.exhoust = 0;
    this.exhoustTime = 1000;
    // this.healthExhoust = 0;
    // this.shotExhoust = 0;
    // this.exhoustHeal = 1000;
    this.redTarget = false;
    this.fistExhoust = false;
    this.restore = false;
    this.sprite = "male_oriental";
    this.skills = {
      level:0,
      exp:0,
      fist:1,
      fist_summary:1,
      dist:1,
      dist_summary:1,
    }
    if(type == "player"){
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
    }
    if(["player","npc"].includes(this.type)){
      this.sayExhoust = false;
    }
    if(nickName == "GM"){
      this.sprite = "gm";
    }
    this.baseSpeed = this.speed;
  }
  getHit = (db,from,type = 'fist') =>{
    if(this.type != "player" || func.isSet(this.totalDef)){
      let hit = from.skills[type];
      if(type == 'dist' && func.isSet(from.totalDist)){
        hit = from.totalDist;
      }
      if(type == 'fist' && func.isSet(from.totalFist)){
        hit = from.totalFist;
      }
      if(this.totalDef > 0){
        hit -= this.totalDef;
      }
      // KILLING SHOT
      if(this.health <= hit){
        this.health = 0;
        from.redTarget = false;
        if(this.type == "player"){
          // downgrade exp
          this.skills.exp = Math.floor(this.skills.exp*0.95);
          this.updateSkills(db);
          this.text = "You're dropped level to "+this.skills.level;
          // save dead
          const deadLog = {
            when: new Date(),
            who: from.name,
            whoType : from.type,
            level: this.skills.level
          };
          if(func.isSet(this.lastDeaths)){
            if(this.lastDeaths.length >= 5){this.lastDeaths.shift()}
            this.lastDeaths.push(deadLog)
          }else{
            this.lastDeaths = [deadLog];
          }
        }
      }else{
        if(hit > 0){
          this.health -= hit;
          this.text = from.name+" takes u "+hit+" hp";
        }
      }
      // COUNT SKILLS
      if(['fist','dist'].includes(type) && from.type == "player" && !isNaN(hit)){
        from.skills[type+'_summary']++;
        from.updateSkills(db);
      }
      // GIVE EXP TO KILLER! 
      if(this.type == "monster" && this.health <= 0){
        from.skills.exp += this.skills.exp;
        from.updateSkills(db);
      }
    }
  }
  updateSkills(db, keys = ['fist','dist']){
    let smthChanged = false;
    // fist, dist update
    for(const key of keys){
      if(!func.isSet(this.skills[key+"_summary"])){this.skills[key+"_summary"] = 0;}
      const newValue = Math.ceil(Math.sqrt(this.skills[key+"_summary"]));
      if(this.skills[key] != newValue && newValue != null && !isNaN(newValue) ){
        this.skills[key] = newValue;
        smthChanged = true;
      } 
    }
    // level update
    if(this.skills.level != Math.ceil(Math.cbrt(this.skills.exp))){
      this.skills.level = Math.ceil(Math.cbrt(this.skills.exp));
      this.speed = 2 + Math.floor(this.skills.level/10)/10;
      this.maxHealth = 100 + Math.floor(this.skills.level*10);
      this.maxMana = 100 + Math.floor(this.skills.level*10);
      smthChanged = true;
    }
    // IF CHANGES - SAVE TO DB
    if(smthChanged && func.isSet(db.update)){
      db.update(this);
    }
  }
  update(param,db,creatures,items){
    this.focus = param.focus;
    // clear console
    if(func.isSet(this.console)){
      delete this.console;
    }
    // SAY'n
    if(func.isSet(this.says)){delete this.says;}
    if(func.isSet(param.says) && param.says != ""){
      console.log(param.says);
      // CONSOLE FOR GM
      const places = {
        temple:[35,-9,-1],
        castle:[49,-34,1],
        wizards:[-70,11,2],
        king:[55,-21,-1],
        dragon:[135,1,0],
        kingslegs:[60,-13,2],
        barbarian:[4,-33,1],
        depo:[43,0,0],
        castlegate:[40,-23,0],
        castletower:[44,-37,4],
        playground:[40,20,0],
      };
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
        }
        if(['!health','!mana'].includes(command[0])){
          this[command[0].replace('!','')] = command[1]*1;
        }
        if(['!exp','!fist_summary','!dist_summary','!level','!fist','!dist'].includes(command[0])){
          this.skills[command[0].replace('!','')] = command[1]*1;
        }
      }
      // TP to temple
      if(param.says == "!temple" && this.type == "player"){
        this.position = [35,-9,-1];
      }
      if(!this.sayExhoust || this.sayExhoust <= game.time.getTime()){
        // PLAYER SAY'N
        if(this.type == "player"){
          this.says = param.says;
          this.sayExhoust = game.time.getTime() + 1000;
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
        if(this.type == "npc"){
          // this.says = "elo"; 
          this.sayExhoust = game.time.getTime() + 1000;

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
      }
    }

    // UPDATE LASTFRAME || KEEP PLAYER IN GAME || save player on logout
    if(typeof game.startServerTime != "undefined" && param.type != 'initUpdate'){
      this.lastFrame = game.time.getTime();
    }
    // GET EQ VALUES (totalHealth, totalMana etc.)
    func.setTotalVals(this);
    // monsters and npc's speed update
    if(["monster","npc"].includes(this.type)){
      if(func.isSet(this.speed) && this.speed != 0){
        this.totalSpeed = this.speed;
        this.baseSpeed = this.speed;
      }else{
        this.totalSpeed = this.baseSpeed;
      }
    }
    // CHECK HEALTH, MANA ON ITEM DROP
    if(this.type == "player"){
      if(this.health > this.totalHealth){
        this.health = this.totalHealth;
      }
      if(this.mana > this.totalMana){
        this.mana = this.totalMana;
      }
    }
    // MANA REGEN
    if(func.isSet(this.totalManaRegen) && this.manaRegenExhoust < game.time.getTime() && this.totalManaRegen > 0 && this.type == "player"){
      if((this.mana + this.totalManaRegen) < this.totalMana){
        this.mana += this.totalManaRegen;
      }else{
       this.mana = this.totalMana;
      }
      const manaExhoust = 1000;
      this.manaRegenExhoust = game.time.getTime()*1 + manaExhoust;
    }
    // SPRITES UPDATE
    if(!func.isSet(this.sprite)){this.sprite = this.sex+"_citizen";}
    if(func.isSet(param.outfit) && this.type == "player"){
      this.sprite = param.outfit.sprite;
      this.colors = param.outfit.colors;
      this.outfitUpdate = true;
    }else{
      delete this.outfitUpdate;
    }
    // set playerinArea (4 monster walking and targeting)
    let playerInArea;
    if(this.type == "monster"){
      for(const c of creatures){
        if(c.type == "player"){
          // add z position
          if(Math.abs(this.position[0] - c.position[0]) < 6 
            && Math.abs(this.position[1] - c.position[1]) < 6
            && this.position[2] == c.position[2]){
            // isPlayerNear = true;
            playerInArea = c;
          }
        }
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
        let isPlayerNear = false;
        creatures.sort().reverse();
        for(const c of creatures){
          if(c.type == "player"){
            if(Math.abs(phantomPos[0] - c.position[0]) < 6 
              && Math.abs(phantomPos[1] - c.position[1]) < 6
              && phantomPos[2] == c.position[2]){
              isPlayerNear = true;
              playerInArea = c;
            }
          }
        }
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
            const routeFinded = func.setRoute(this.position,playerInArea.position,map,creatures);
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
      // checking if position is availble
      let isFloor = false;
      // let isFloor = true;
      let isStairs = false;
      let isWall = false;
      let doorAvalible = true;
      // check grids 
      const avalibleGrids = func.equalArr(map.avalibleGrids);
      const notAvalibleGrids = func.equalArr(map.notAvalibleGrids);
      if(this.type == "player" && !avalibleGrids.includes("stairs")){
        avalibleGrids.push("stairs");
        avalibleGrids.push("actionfloors");
        notAvalibleGrids.splice(notAvalibleGrids.indexOf("stairs"),1);
      }else if(this.type != "player" && avalibleGrids.includes("stairs")){
        notAvalibleGrids.push("stairs");
        // avalibleGrids.splice(avalibleGrids.indexOf("stairs"),1);
      }
      // ladder 
      if(this.type == "player"){
        for(const item of items.itemsInArea){
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
      const checkGrids = map.getGrid(phantomPos);
      for(const checkGrid of checkGrids){
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
            if(this.type == "player" && func.isSet(checkGrid[5])){
              // cases when player can pass through
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
      // check monsters and players on position
      for(const c of creatures){
        if (
          // if player is on the same pos with live creature
          (func.compareTables(c.position, phantomPos) && c.health > 0) 
          // and if creature is no player and there's no stairs
          // && ((this.type != "player" && !isStairs)
          // and if creature is no player and there's stairs
          && ((this.type != "player" && isStairs)
          // && ((["player","npc","monster"].includes(c.type) && isStairs)
          // or creature is current player
          ||(this.id != c.id))
        ){
          isFloor = false;
        }else if(
          // when there's other creature on stairs - go on
          this.type == "player" && ["npc","player","monster"].includes(c.type)
          && isStairs
        ){
          isFloor = true;
        }
      }
      // check items can't walk and walkon
      let isItem = false;
      let itemText = false;
      for(const i of items.itemsInArea){
        if(func.compareTables(phantomPos,i.position)){
          if(func.isSet(i.walkThrow) && i.walkThrow == false){
            isItem = true;
          }
          if(func.isSet(i.walkOn)){
            itemText = true;
            i.walkOn(this,i);
            // i.walkOn(this,i);
          }
        }
      }
      if(isItem){isFloor = false;}

      // monsters & npc's staying
      if(!isFloor && ["npc","monster"].includes(this.type)){
        // set exhoust
        this.walk = game.time.getTime() + Math.round(1000/this.totalSpeed);
        this.speed = 0;
      }else if(["npc","monster"].includes(this.type)){
        this.speed = this.totalSpeed;
      }

      // set new position or display error
      if(isFloor){
        if((this.type == "player" && typeof key != "undefined") 
        || (["monster","npc"].includes(this.type) && !func.compareTables(this.position,phantomPos)) ){
          // for monsters
          delete this.escapeStuck;
          // set exhoust
          this.walk = game.time.getTime() + Math.round(1000/this.totalSpeed);
          this.position = phantomPos;
        }
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
            || Math.abs(c.position[0] - this.position[0]) > 5
            || Math.abs(c.position[1] - this.position[1]) > 5
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
      // for monsters
      if(this.type == "monster"){
        this.restore = game.time.getTime() + 60000;
      }
      if(this.type == "npc"){
        this.restore = game.time.getTime();
      }
      if(this.name == param.name){
        this.direction = 4;
        game.dead = true;
      }
    }
    // RESTORING [monster]
    if(this.restore && game.time.getTime() >= this.restore){
      this.health = this.maxHealth;
      this.restore = false;
      this.direction = 1;
      if(!this.type == "npc"){
        this.position = this.startPosition;
        this.cyle = this.defaultCyle;
      }
    } 
    // HEALING [player]
    // if(typeof param.controls != "undefined" && param.controls.includes(72) && this.healthExhoust <= game.time.getTime() && this.type=="player" && this.health > 0){  
    if(typeof param.controls != "undefined" && param.controls.includes(72) && this.exhoust <= game.time.getTime() && this.type=="player" && this.health > 0){  
      // 72 is "H" key
      const healValue = Math.floor(this.totalHealth/10);
      const manaSpend = 50;
      if(this.mana >= manaSpend && this.health < this.totalHealth){
        this.mana -= manaSpend; 
        if(this.health + healValue >= this.totalHealth){
          this.health = this.totalHealth;
        }else{
          this.health += healValue;
        }
      }else{
        if(this.mana < manaSpend){
          this.text = "You have no mana.";
        }else{
          this.text = "You're full of health";
        }
      }
      // this.healthExhoust =  game.time.getTime() + this.exhoustHeal;
      this.exhoust =  game.time.getTime() + this.exhoustTime;
    }
    // HEALING [monster]
    // if(this.type == "monster" && func.isSet(this.skills.healing) && this.skills.healing > 0 && this.healthExhoust <= game.time.getTime() && this.health > 0){
    if(this.type == "monster" && func.isSet(this.skills.healing) && this.skills.healing > 0 && this.exhoust <= game.time.getTime() && this.health < (0.5*this.maxHealth) && this.health > 0){
      if(this.health + this.skills.healing > this.maxHealth){
        this.health = this.maxHealth;
      }else{
        if(!func.isSet(this.skills.healing)){this.skills.healing = 100;}
        this.health += this.skills.healing;
      }
      // this.healthExhoust =  game.time.getTime() + this.exhoustHeal;
      this.exhoust =  game.time.getTime() + this.exhoustTime;
    }
    // SHOTS
    if(this.redTarget){
      for(const c of creatures){
        // attack
        if(c.id == this.redTarget && this.id != c.id && c.health > 0 && this.health > 0){
          // FIST FIGHTING
          if(this.skills.fist > 0 && this.fistExhoust <= game.time.getTime() && c.position[2] == this.position[2] &&Math.abs(c.position[1] - this.position[1]) <= 1 &&Math.abs(c.position[0] - this.position[0]) <= 1 ){
            this.fistExhoust = game.time.getTime() + 1000;
            c.getHit(db,this);
          }
          // DISTANCE SHOT - 68 is "D" key [players]
          // if(typeof param.controls != "undefined" && this.shotExhoust <= game.time.getTime() && ((this.type == "player" && param.controls.includes(68)) || (this.type == "monster" && this.skills.dist > 0))){
          if(typeof param.controls != "undefined" && this.exhoust <= game.time.getTime() && ((this.type == "player" && param.controls.includes(68)) || (this.type == "monster" && this.skills.dist > 0))){
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
            // CHECK GRIDS
            let isWall = false;
            for(const p of trace){
              for(const g of map.getGrid([p[0],p[1],this.position[2]])){
                if(g[4] == "walls"){
                  isWall = true;
                  break;
                }  
              }
            }
            // SHOT IF THERE'S NO WALL
            if(!isWall){
              this.shotTarget = c.id;
              // this.shotExhoust = game.time.getTime() + 1500;
              this.exhoust = game.time.getTime() + this.exhoustTime;
              this.bulletOnTarget = game.time.getTime()+300;
              setTimeout(() => { c.getHit(db,this,'dist'); }, 300);
            }
          }
        }
      }
    }
    // ITEM DROPING AND PICK UPING
    if(param.itemAction){
      const item = new Item(param.itemAction);
      item.relocate(this,items,param.itemAction)
      delete param.itemAction;
    }
  }
}
class Item{
  constructor(obj){
    this.rewrite(obj);
  }
  makeNew(obj,where,creature){
    const item = new Item(obj);
    // GENERATE RANDOM STATS:
    if(func.isSet(item.randStats)){
      // let x;
      for(const randStat of item.randStats){
        // 50% chance of display this stat
        if(Math.round(Math.random())){
          const key = Object.keys(randStat)[0];
          const [min, max] = randStat[key].split("-");
          const value = min*1 + Math.floor(Math.random() * max);
          if(value > 0){
            item[key] = value;
          }       
        }
      }
    }
    if((func.isSet(creature.boxExhoust) && creature.boxExhoust <= game.time.getTime()) || !func.isSet(creature.boxExhoust)){
      let setted = false;
      let f; // key of eq item
      // check empty places in eq
      if(where == "eq" && func.isSet(item.handle)){
        for(f of item.handle){
          if(!creature.eq[f]){
            setted=true;
            break;
          }
        }
      }
      // check player quests
      let isQuest = false;
      for(const quest of creature.quests){
        if(quest == item.name){
          isQuest = true;
          break;
        }        
      }
      // display result
      if(isQuest && creature.name != "GM"){
        creature.text = "The box is empty.";
      }else if(!setted){
        creature.text = "You have no empty places.";
      }else{
        creature.text = "You've found a "+item.name;
        creature.eq[f] = item;
        creature.quests.push(item.name)
      }
      // set exhoust on box
      creature.boxExhoust = game.time.getTime()+1000;
    }
  }
  relocate(creature,items,itemAction){
    // EQ TO MAP
    if(itemAction.actionType == 'drop'){
      if(func.isSet(itemAction.field) && itemAction.field != "" ){
      // DROP ITEM
        // SET DROPPING FLOOR [WHEN DROP IS BETWEEN FLOORS]
        let isPos = false;
        for(let floor = this.visibleFloor; floor >= map.minFloor; floor--){
          const checkPosition = [this.position[0],this.position[1],floor];
          for(const grid of map.getGrid(checkPosition)){
            if(grid[4] == "floors"){
              isPos = true;
              this.position = checkPosition;
              break;
            }
          }
          if(isPos){break;} 
        }
        if(isPos){
          // CHECK IF ITEM IS REALLY IN THIS EQ FIELD
          let isInField = false;
          for(const field of Object.keys(creature.eq)){
            if(field == this.field){
              isInField = true;
              break;
            }
          }
          if(isInField){
            // DELETE IT FROM EQ
            creature.eq[this.field] = false;
            // ADD IT TO MAP
            items.allItems.push(this);
            creature.text = "You dropped out a "+this.name+".";
          }else{
            creature.text = "Sorry, it not possible.";
          }
        }else{
          creature.text = "Sorry, it not possible.";
        }
      }else if( itemAction.field == ""){
          // ADD IT TO MAP
          items.allItems.push(this);
          creature.text = "You dropped out a "+this.name+".";
      }else{
        creature.text = "You can't drop this out.";
      }
    }
    // MAP TO EQ OR BP
    if(itemAction.actionType == 'pickUp'){
      if(this.pickable){
        let move = false;
        // try to move this item to eq
        for(const handle of this.handle){
          if(!creature.eq[handle]){
            move = true;
            creature.eq[handle] = this;
            break;
          }
        }
        // if eq is full, try give it to bp
        if(!move && creature.eq.bp){
          if(!func.isSet(creature.eq.bp.in)){creature.eq.bp.in = [];}
          // check fields in bp
          if(creature.eq.bp.in.length < creature.eq.bp.cap){
            creature.eq.bp.in.push(this);
            move = true;
          }
        }
        // SHOW RESULT
        if(!move){
          creature.text = "You can't pick up this "+this.name;
        }else{
          creature.text = "You picked up "+this.name;
          // clear it from itemlist
          this.delete = true;
          // to last dropped on top
          items.allItems.reverse();
          items.allItems.splice(items.allItems.map((e)=>{ 
            if(func.compareTables(e.position, this.position)){
              // this.delete = true;
              e.delete = true;
              return this.delete
            }else{
              return 0;
            }
          }).indexOf(this.delete),1);
          // reverse it as at begin.
          items.allItems.reverse();
          delete this.delete;
        }
      }else{
        creature.text = "You can't take this item."
      }
    }
  }
  rewrite(obj){
    if(func.isSet(obj)){
      // MAKE WITH OBJ
      for(const key of Object.keys(obj)){
        this[key] = obj[key];
      }  
      // UPDATE IT FROM PROPERTIES FROM ITEMS TYPES
      for(const it of itemsTypes){
        if(func.isSet(obj.name) && obj.name == it.name){
          for(const key of Object.keys(it)){
            if(!func.isSet(this[key])){
              this[key] = it[key];
            }
          }
        }
      }
      // FILL ID IF IS NOT
      // if(!func.isSet(this.id)){
      //   this.id = itemID++;
      // }
    }
  }
}
module.exports = [Creature,Item];