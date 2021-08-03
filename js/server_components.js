class Creature {
  constructor(nickName,creaturesLength){
    this.id = creaturesLength+1; 
    this.name = nickName;
    this.position = [2,3,0];  // left tower down
    // this.position = [1,5,1];  // left tower up
    this.walk = 0;
    this.speed = 5; // grids per second
    this.sprite = "citizen";
    this.health = 1000;
    this.redTarget = false;
  }
  update(param = {name:""},game,map,func,creatures){
    // WALKING
    if(this.walk <= game.time.getTime() && this.health > 0){
      let phantomPos = [this.position[0], this.position[1], this.position[2]];;
      // player walking from pushed keys
      if(this.type == "player"){
        // get clicked key
        const key = param.controls.split(",")[0];
        // set probably future position
        switch (key) {
          case '39': phantomPos[0]++; break; // right key
          case '37': phantomPos[0]--; break; // left key
          case '38': phantomPos[1]--; break; // up key
          case '40': phantomPos[1]++; break; // down key
        }
      }
      // monsters walking
      if(this.type == "monster"){
        // set walking type (random / follow / escape)
        let walkingMode = "random";
        let isPlayerNear = false;
        let playerInArea;
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
          if(this.health > 200){
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
        if (walkingMode == "follow") {
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
      // check grids
      for (let grid of map) {
        if (func.compareTables([grid[1],grid[2],grid[3]], phantomPos)) {
          if (typeof grid[4] !== "undefined" && grid[4] == "stairs") {
            // STAIRS / TELEPORTS ETC.
            phantomPos = grid[5];
            // console.log(grid[5]);
          }else{
            // console.log("IDEM");
          }          
          isFloor = true;
          break;
        }        
      }
      // check monsters and players
      for(const c of creatures){
        if (func.compareTables(c.position, phantomPos) && c.name != param.name) {
          isFloor = false;
        }        
      }
      // set new position or display error
      if(isFloor){
        this.position = phantomPos;
        const key = param.controls.split(",")[0];
        if((this.type == "player" && ['37','38','39','40'].includes(key)) 
        || this.type == "monster"){
          // set exhoust
          this.walk = game.time.getTime() + Math.round(1000/this.speed);
        }
      }else if(this.type == "player"){
        this.text = "NO FUCKING WAY.";
      }
    }
    // RED TARGETING
    const key = "redTarget";
    if(Object.keys(param).includes(key)){
      if(param[key] != "clear"){
        this[key] = param[key];     
      }else{        
        this[key] = false;
      }
    }
    if(this.redTarget){
      for(const c of creatures){
        if(c.id == this.redTarget && this.id != c.id){
          if(c.health > 0 ){
            // FIST FIGHTING
            if(
              c.position[2] == this.position[2]
              &&Math.abs(c.position[1] - this.position[1]) <= 1
              &&Math.abs(c.position[0] - this.position[0]) <= 1  
            ){
              console.log(c.position[1]  +" / " +this.position[1] +" | "+c.position[0]  +" / " +this.position[0] )
              c.health -= 5;
            }
          }else{
            // DIE
            this.redTarget = false;      
            this.text = "Red target lost.";
          }

        }
      }

    



    }

    // DYING
    if(this.health <= 0){
      // DieList 
      for(const c of creatures){
        
        if(c.id == this.id){
          this.direction = 4;
          this.cyle = 0;
          // clear from target list
          for(const c of creatures){
            if(c.redTarget == this.id){
              c.redTarget = 0;
              this.redTarget = 0
            }
          }
        }
      }

    }
  }
}


module.exports = Creature;