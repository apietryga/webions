const dbConnect = require("./dbconnect");
const dbc = new dbConnect();
const Map = require("../public/js/map");
const map = new Map();
const func = require("../public/js/functions");
class Creature {
  constructor(nickName,creaturesLength){
    this.id = creaturesLength+1; 
    this.name = nickName;
    this.position = [34,-10,0];
    this.startPosition = this.position;
    this.walk = false;
    this.speed = 2; // grids per second
    this.direction = 1;
    this.health = 2000;
    this.healthValue = 10;
    this.maxHealth = this.health;
    this.healthExhoust = 0;
    this.exhoustHeal = 1000;
    this.shotExhoust = 0;
    this.redTarget = false;
    this.fistExhoust = false;
    this.restore = false;
    this.skills = {
      level:0,
      exp:1,
      fist:100,
      dist:100,
      healing:100,
    }
    this.colors = {
      head: [240, 169, 98],
      chest: [240, 98, 98],
      legs: [155, 155, 155],
      foots: [13, 13, 13]
    }
  }
  update(param,game,creatures){
    if(!func.isSet(this.sprite)){this.sprite = this.sex+"_citizen";}
    // SPRITE CHANGER
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
    if(this.walk <= game.time.getTime() && this.health > 0 && this.speed > 0){
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
      // monsters walking
      if(this.type == "monster"){
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
        if(isPlayerNear){
          if(this.health > 0.2*this.maxHealth && playerInArea.health > 0){
            walkingMode = "follow";
          }else{
            walkingMode = "escape";
          }
        }
        // move monster
        let r;  // direction of move
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
      //*
      // check grids 
      const avalibleGrids = (map.avalibleGrids);
      const notAvalibleGrids = map.notAvalibleGrids;
      if(this.type == "player" && !avalibleGrids.includes("stairs")){
        avalibleGrids.push("stairs");
        avalibleGrids.push("actionfloors");
        notAvalibleGrids.splice(notAvalibleGrids.indexOf("stairs"),1);
      }else if(this.type != "player" && avalibleGrids.includes("stairs")){
        notAvalibleGrids.push("stairs");
        avalibleGrids.splice(avalibleGrids.indexOf("stairs"),1);
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
            if(this.type == "monster"){isFloor = false;}
            if(this.type == "player"){
              isStairs = true;
              phantomPos = checkGrid[5];
            }
          }
          if(checkGrid[4] == "doors"){
            doorAvalible = false;
            if(this.type == "monster"){isFloor = false;}
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
      // check monsters and players
      for(const c of creatures){
        if ((func.compareTables(c.position, phantomPos) && c.health > 0) && ((this.type != "player" && !isStairs)||(this.id != c.id))) {
            isFloor = false;
        }        
      }
      // */
      // set new position or display error
      if(isFloor){
        if((this.type == "player" && typeof key != "undefined") 
        || (this.type == "monster" && !func.compareTables(this.position,phantomPos)) ){
          // for monsters
          delete this.escapeStuck;
          // set exhoust
          this.walk = game.time.getTime() + Math.round(1000/this.speed);
          this.position = phantomPos;
        }
      }else if(this.type == "player" && typeof key != "undefined" && doorAvalible){
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
        this.restore = game.time.getTime() + 150000;
        // this.restore = game.time.getTime() + 500;
      }
      if(this.name == param.name){
        this.direction = 4;
        game.dead = true;
      }
    }
    // RESTORING [monster]
    if(this.restore && game.time.getTime() >= this.restore){
      this.health = this.maxHealth;
      // this.cyle = 0;
      this.direction = 1;
      this.cyle = this.defaultCyle;
      // this.direction = this.defaultDirection;
      this.restore = false;
      this.position = this.startPosition;
    } 
    // HEALING
    if(typeof param.controls != "undefined" && param.controls.includes(72) && this.healthExhoust <= game.time.getTime() && this.type=="player" && this.health > 0){  
      // 72 is "H" key
      // const healthExhoust = 1500; // [ms(exhoust),hp(value)]      
      if(this.health + this.skills.healing > this.maxHealth){
        this.health = this.maxHealth;
      }else{
        if(!func.isSet(this.skills.healing)){this.skills.healing = 100;}
        this.health += this.skills.healing;
      }
      this.healthExhoust =  game.time.getTime() + this.exhoustHeal;
    }
    // SELF AUTO HEALING
    // TODO - SELF AUTO HEALING!

    // SHOTS
    if(this.redTarget){
      for(const c of creatures){
        // attack
        if(c.id == this.redTarget && this.id != c.id && c.health > 0 && this.health > 0){
          // FIST FIGHTING
          if(this.skills.fist > 0 && this.fistExhoust <= game.time.getTime() && c.position[2] == this.position[2] &&Math.abs(c.position[1] - this.position[1]) <= 1 &&Math.abs(c.position[0] - this.position[0]) <= 1 ){
            this.fistExhoust = game.time.getTime() + 1000;
            c.getHit(game,this);
          }
          // DISTANCE SHOT - 68 is "D" key [players]
          if(typeof param.controls != "undefined" && this.shotExhoust <= game.time.getTime() && ((this.type == "player" && param.controls.includes(68)) || (this.type == "monster" && this.skills.dist > 0))){
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
              this.shotExhoust = game.time.getTime() + 1500;
              this.bulletOnTarget = game.time.getTime()+300;
              setTimeout(() => { c.getHit(game,this,'dist'); }, 300);
            }
          }
        }
      }
    }
  }
  getHit = (game,from,type = 'fist') =>{
    // if u killed him
    if(this.health <= from.skills[type]){
      this.health = 0;
      from.redTarget = false;
    }else{
      this.health -= from.skills[type];
    }
    this.text = from.name+" Cię walnął za "+from.skills[type]+" hapa";
    // GIVE EXP TO KILLER! 
    if(this.type == "monster" && this.health <= 0){
      from.skills.exp += this.skills.exp;
      from.updateSkills(game);
    }
  }
  updateSkills(game){
    const oldLvl = this.skills.level; 
    this.skills.level = Math.ceil(Math.sqrt(this.skills.exp));
    if(this.skills.level != oldLvl){
      this.maxHealth = Math.ceil(1000 + (this.skills.exp/4));
      this.health = this.maxHealth;
      this.speed = 3 + Math.floor(this.skills.exp/100)/10;
      this.speed>10?this.speed=10:'';
      this.skills.fist = Math.ceil(100 + (this.skills.exp/100));
      this.skills.dist = Math.ceil(100 + (this.skills.exp/100));
      this.skills.healing = Math.ceil(100 + (this.skills.exp/100));
      dbc[game.db].update(this);
    }
  }
}
module.exports = Creature;