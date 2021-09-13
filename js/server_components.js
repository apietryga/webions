const dbConnect = require("./dbconnect");
const dbc = new dbConnect();
class Creature {
  constructor(nickName,creaturesLength){
    this.id = creaturesLength+1; 
    this.name = nickName;
    this.position = [10,13,0];  // left tower down
    // this.position = [2,3,0];  // left tower down
    // this.position = [20,13,1];  // left tower down
    // this.position = [1,5,1];  // left tower up
    this.startPosition = this.position;
    this.walk = 0;
    this.speed = 2; // grids per second
    // this.sprite = "male_warrior";
    this.sprite = "male_oriental";
    // this.sprite = "citizen";
    if(this.name == "Zuzia"){
      this.sprite = "female_oriental";
      // this.sprite = "female_warrior";
      // this.sprite = "femaleCitizen";
    }
    if(this.name == "Justyna"){this.sprite = "female_warrior";}
    if(this.name == "Kotul"){this.sprite = "male_warrior";}

    this.health = 2000;
    this.healthValue = 10;
    this.maxHealth = this.health;
    this.healthExhoust = 0;
    this.exhoustHeal = 1000;
    this.shotExhoust = 0;
    // this.shotPosition = false;
    this.redTarget = false;
    this.fistFighting = false;
    this.restore = false;
    this.skills = {
      level:0,
      exp:1,
      fist:100,
      dist:100,
      healing:100,
    }
  }
  update(param,game,map,func,creatures){
    // console.log(param);
    this.game = game;
    // for monster walking and targeting
    let playerInArea;
    // WALKING
    if(this.walk <= game.time.getTime() && this.health > 0){
      let phantomPos = [this.position[0], this.position[1], this.position[2]];;
      // player walking from pushed keys
      let key;
      if(this.type == "player"){
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
          case 39: phantomPos[0]++; break; // right key
          case 37: phantomPos[0]--; break; // left key
          case 38: phantomPos[1]--; break; // up key
          case 40: phantomPos[1]++; break; // down key
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
            // add z position
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
        if(walkingMode == "random") {
          r = Math.floor(Math.random() * 4);
        }
        if(walkingMode == "follow") {
          let [monX,monY] = this.position;
          let [plaX,plaY] = playerInArea.position; 
          let posibilites = [];
          if(monX > plaX){posibilites.push(3);}
          if(monX < plaX){posibilites.push(1);}
          if(monY < plaY){posibilites.push(2);}
          if(monY > plaY){posibilites.push(0);}      
          let posibilitesId = Math.round(Math.random()*(posibilites.length-1));
          r = posibilites[posibilitesId];
          // set it done
          if(posibilites.length == 1 && (Math.abs(monX-plaX) == 1 || Math.abs(monY-plaY) == 1)){
            r = -1;
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
        }
        if (r == 0) {phantomPos[1]--;} // up
        if (r == 1) {phantomPos[0]++;} // right
        if (r == 2) {phantomPos[1]++;} // down
        if (r == 3) {phantomPos[0]--;} // left
        // r == -1 -> stop, but wait this time
      }

      // checking if position is availble
      let isFloor = false;
      let isStairs = false;
      // check grids
      for (let grid of map) {
        if (func.compareTables([grid[1],grid[2],grid[3]], phantomPos)) {
          if (typeof grid[4] != "undefined" && grid[4] == "stairs") {
            // STAIRS / TELEPORTS ETC.
            phantomPos = grid[5];
            if(this.type == "monster"){
              break;
            }
            isStairs = true;
          }
          isFloor = true;
          break;
        }        
      }
      // check monsters and players
      for(const c of creatures){
        if (func.compareTables(c.position, phantomPos) && c.name != param.name && c.health > 0) {
          isFloor = false;
          if(this.type == "player" && isStairs){
            isFloor = true;
          }
        }        
      }
      // set new position or display error
      if(isFloor){
        // let key;
        // const key = param.controls.split(",")[0];
        // const key = param.controls[0];
        this.position = phantomPos;
        if((this.type == "player" && typeof key != "undefined") 
        || this.type == "monster"){
          // set exhoust
          this.walk = game.time.getTime() + Math.round(1000/this.speed);
        }
      }else if(this.type == "player"){
        this.text = "There's no way.";
      }
    }
    // RED TARGETING [player] 
    if(this.type == "monster"&& typeof playerInArea != "undefined"&& this.health > 0.2*this.maxHealth){
      // monster
      this.redTarget = playerInArea.id;
    }else if(typeof param.controls != "undefined" && param.controls.includes(83) && typeof param.target != "undefined"){
      // player
      this.redTarget = param.target;
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
    // SHOTS
    if(this.redTarget){
      for(const c of creatures){
        // attack
        if(c.id == this.redTarget && this.id != c.id){
          if(c.health > 0 && this.health > 0){
            // FIST FIGHTING
            if( this.fistFighting <= game.time.getTime() &&c.position[2] == this.position[2] &&Math.abs(c.position[1] - this.position[1]) <= 1 &&Math.abs(c.position[0] - this.position[0]) <= 1 ){
              this.fistFighting = game.time.getTime() + 1000;
              c.getHit(this,this.skills.fist);
            }
            // DISTANCE SHOT - 68 is "D" key [players]
            if(param.controls.includes(68) && this.shotExhoust <= game.time.getTime() && this.type == "player"){
              // set coords
              this.shotPosition = [this.position,c.position];
              this.shotExhoust = game.time.getTime() + 1000;
              this.bulletTime = game.time.getTime()+200;
            }
            // DISTANCE SHOT [monsters]
            if(this.skills.dist > 0 && this.shotExhoust <= game.time.getTime() && this.type == "monster"){
              // set coords
              this.shotPosition = [this.position,c.position];
              this.shotExhoust = game.time.getTime() + 1000;
              this.bulletTime = game.time.getTime()+200;
            }
          }
        }
        
      }
    }
    // GET HITTING
    for(const c of creatures){
      if(c.redTarget == this.id){
        // distance shot
        if(typeof c.shotPosition != "undefined"
        && typeof c.bulletTime != "undefined"
        && c.bulletTime <= game.time.getTime() 
        ){
          // console.log(this.name + " is hited by "+from)

          this.getHit(c,c.skills.dist);
          // c.shotExhoust = game.time.getTime() + 1000;
          delete c.bulletTime;
          delete c.shotPosition;          
        }
      }
    }
    // DYING
    if(this.health <= 0 && !this.restore){
      this.restore = game.time.getTime() + 150000;
      // this.restore = game.time.getTime() + 1800;
      if(this.type=="player"){
        this.restore = game.time.getTime();
      }
      // this.text = "You are dead. Wait 30 seconds to retrive.";

      // DieList 
      for(const c of creatures){   
        if(c.id == this.id){
          this.direction = 4;
          this.cyle = 0;
          // clear from target list
          for(const c of creatures){
            if(c.redTarget == this.id){
              c.redTarget = false;
              this.redTarget = false
            }
          }
        }
      }

    }
    // RESTORING
    if(this.restore && game.time.getTime() >= this.restore){
      this.health = this.maxHealth;
      // this.cyle = 0;
      // this.direction = 1;
      delete this.cyle;
      delete this.direction;
      this.restore = false;
      this.position = this.startPosition;
    } 
    // HEALING
    if(typeof param.controls != "undefined" && param.controls.includes(72) && this.healthExhoust <= game.time.getTime() && this.type=="player" && this.health > 0){  
      // 72 is "H" key
      const healthExhoust = 1500; // [ms(exhoust),hp(value)]      
      if(this.health + this.skills.healing > this.maxHealth){
        this.health = this.maxHealth;
      }else{
        this.health += this.skills.healing;
      }
      this.healthExhoust =  game.time.getTime() + this.exhoustHeal;
    }

    // SELF AUTO HEALING


  }
  getHit = (from,hp) =>{
    this.health -= hp;
    this.text = from.name+" Cię walnął za "+hp+" hapa";
    // GIVE EXP TO KILLER! 
    if(this.type == "monster" && this.health <= 0){
      from.skills.exp += this.skills.exp;
      from.updateSkills(game);
    }
  }
  updateSkills(){
    const oldLvl = this.skills.level; 
    this.skills.level = Math.ceil(Math.sqrt(this.skills.exp));
    if(this.skills.level != oldLvl){
      this.maxHealth = Math.ceil(1000 + (this.skills.exp/4));
      this.health = this.maxHealth;
      this.speed = 3 + Math.floor(this.skills.exp/100)/10;
      this.speed>10?this.speed=10:'';
      this.fist = Math.ceil(100 + (this.skills.exp/100));
      this.dist = Math.ceil(100 + (this.skills.exp/100));
      this.healing = Math.ceil(100 + (this.skills.exp/100));
      dbc[this.game.db].update(this);
    }
  }
}
module.exports = Creature;