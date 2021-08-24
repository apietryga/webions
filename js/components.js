class Creature {
  constructor(type,x, y, z, pName){
    this.type = type;
    this.cyle = 0;
    this.name = pName;
    this.width = 40;
    this.height = 40;
    this.sprite = "citizen"; 
    this.hideFloor = "none";
    this.x = x ;
    this.y = y ;
    this.z = z;
    if(this.type == "player"){
      this.x = 200;
      this.y = 200;
    }
    this.direction = 1;
    this.position = [x, y, this.z]; //x y z
    this.newPos =  equalArr(this.position);
    this.oldPos =  equalArr(this.position);
    this.walkFps = 0;
    this.bulletCyle = 0;
    this.health = 1000;
    this.maxHealth = 1000;
    this.targetlist = [];
    this.currentTarget = false;
    this.sendTarget = false;
    this.isTarget = false;
    this.currentExshoust = false;
    this.fistExhoust = 15;
  }
  update(){
    // WALKING
    // console.log(this.walk);
    if(this.walk >= serv.time){
      // walking cyle (animation)
      this.walkFps++;
      let cPC = 0; // change per cyle 
      if(this.speed <= 1){cPC = 3;}
      if(this.speed > 1 && this.speed < 3){cPC = 2;}
      if(this.speed >= 3){cPC = 1;}
      if((this.walkFps) % cPC == 0){
        this.cyle = ((this.cyle)%2)+1;
      }
      // set position
      const directions = [[3, 2],[0,1]];
      const walkTime = this.walk - this.walkingStart;
      const timeLeft = walkTime - (serv.time - this.walkingStart);
      const piece = 1 - Math.round((timeLeft/walkTime)*10)/10;
      this.position = equalArr(this.oldPos);
      for(let l of [[0,1],[1,0]]){
        if(this.newPos[2] != this.oldPos[2]){
          this.position = this.newPos;
        }
        if(this.newPos[l[0]] == this.oldPos[l[0]] ){
          if(this.newPos[l[1]] > this.oldPos[l[1]]){
            this.position[l[1]] = this.oldPos[l[1]] + piece;
            this.direction = directions[l[1]][1];
          }else if(this.newPos[l[1]] < this.oldPos[l[1]]){
            this.position[l[1]] = this.oldPos[l[1]] - piece;
            this.direction = directions[l[1]][0];
          }
        }
      }
    }else{
      this.cyle = 0;
      this.walkFps = 0;
      this.position = this.newPos;
    }
    // Death
    if(this.health <= 0){
      // this.cyle = 7;
      this.cyle = 0;
      this.direction = 4;
      this.whiteTarget = false;
    }
    if(this.type != "player"){
      this.x = (this.position[0] - player.position[0] + 5) * 40;
      this.y = (this.position[1] - player.position[1] + 5) * 40;  
    }
  }
  draw(zIndex = 0){
    // DRAW BY ZINDEX
    if(zIndex == this.position[2] && player.hideFloor != zIndex){
      let ctx = gamePlane.context;
      // draw target
      if(this.type != "player" && !map.hideFloor.includes(this.zIndex)){
        if(this.whiteTarget){
            // console.log(this.whiteTarget)
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.strokeStyle = 'white';

            ctx.lineWidth = 3;
            ctx.rect(this.x+3, this.y+3, this.width-6, this.height-6);
            ctx.stroke();
        }
        // console.log(player.redTarget)
        if(this.id == player.redTarget & this.health > 0){
          ctx.beginPath();
          ctx.fillStyle = "red";
          ctx.strokeStyle = 'red';
          ctx.lineWidth = 3;
          ctx.rect(this.x, this.y, this.width, this.height);
          ctx.stroke();  
        }
      }
      // draw sprite
      let img = gamePlane.sprites[this.sprite];
      ctx.drawImage(
        img, this.cyle * img.width/3, this.direction * img.width/3, img.width/3, img.height/5,
        this.x - 40, this.y-40, 100, 100
      );
      // draw name and health bar
      if(this.health > 0 && this.position[2] == player.position[2]){
        let maxBarWidth = 28;
        let barWidth = (maxBarWidth * this.health) / this.maxHealth;
        let percHealth = (100 * this.health) / this.maxHealth;
        ctx.fillStyle = hpColor(percHealth);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.font = '900 10px Tahoma';
        ctx.textAlign = "center";
        // console.log(this.name+" : "+this.y);
        ctx.fillText(this.name, this.x + 5, this.y - 22);
        ctx.strokeText(this.name, this.x + 5, this.y - 22);
        ctx.beginPath();
        ctx.rect(this.x - 11, this.y - 18, 30, 5);
        ctx.fillRect(this.x - 10, this.y - 17, barWidth, 3);
        ctx.stroke();
      }
      // stand up after retrive
      if(this.oldHealth <= 0 && this.health > 0){
        this.direction = 1;
      }
      // draw hits and healing value
      if(this.oldHealth != this.health){
        const hitValue = this.oldHealth - this.health;
        gamePlane.actions.push(new Action("hitText",this.position[0],this.position[1],100,200,hitValue));
      }
      // draw shot's bullets
      if(this.shotPosition && typeof this.shotPosition != "undefined" ){
        if(typeof this.shotBullet == "undefined"){
          // first frame
          this.shotBullet = new Action("bullet",this.position[0],this.position[1],10,10,"POCISK");
          this.startBullet = serv.time;
          this.bulletCyle = 0;
          // this.bulletPiece[0] = this.shotPosition[1][0] - this.shotPosition[0][0];
          // this.bulletPiece[1] = this.shotPosition[1][1] - this.shotPosition[0][1];
        }else{
          // other frames
          this.bulletCyle++;
          // console.log(this.bulletCyle);
          // const distanceX = Math.abs(this.shotPosition[1][0] - this.shotPosition[0][0]);
          const pieceX =  this.bulletCyle;
          // startbullet - 0 
          // endbullet


          // console.log(pieceX )
          for(const [x,y] of [[0,1],[1,0]]){
            if(this.shotPosition[x][0] > this.shotPosition[y][0]){
            // this.shotPosition[x][0]+=pieceX;
              this.shotBullet.x -= pieceX;

            }else{
              // this.shotPosition[x][0]-=pieceX;
              this.shotBullet.x += pieceX;

            }
            // on target
            // if(this.shotPosition[1][0] == this.shotBullet.x
            //   && this.shotPosition[1][1] == this.shotBullet.y){
            //   console.log("ON TARGET")
            // }
          }       
          this.shotBullet.update();
        }
        // console.log(this.shotPosition)
        // if(typeof this.shotPosition == "undefined"){
          // console.log("ON TARGET");
        // }

      }else{
        // console.log(this.lastShotPosition);
        // console.log(this.lastShotPosition);
        // if(this.bulletCyle && this.bulletCyle != 0){
        if(this.shotExhoust <= serv.time && this.bulletCyle > 0){
          
          console.log(this.shotPosition)

        }
        
      }
      // console.log(this.lastShotPosition +" / "+ this.shotPosition)
      if( this.lastShotPosition && typeof this.shotPosition == "undefined" ){
        // if(this.lastShotPosition && !this.bulletCyle){
        console.log(this.lastShotPosition)
        console.log(this.shotPosition)
        // console.log(this.bulletCyle);
        console.log("ON TARGET");
        delete this.shotPosition;
        delete this.lastShotPosition;

        this.bulletCyle = false;
      }
      // console.log(this.lastShotPosition);

    }
  }
}
class Grid {
  constructor(t) {
    if (typeof t[4] == "undefined") { t[4] = "floor"; }
    this.texture = t[0];
    this.position = [t[1], t[2], t[3]];
    this.type = t[4];
    this.width = 40;
    this.height = 40;
    this.zIndex = t[3];
    this.checked = false;
    if (typeof t[5] != "undefined") {this.attr = t[5][2];}
    this.passThrough = true;
    if (t[4] != "floor") { this.passThrough = false; }
    this.x = (this.position[0]) * this.width;
    this.y = (this.position[1]) * this.height;
  }
  update = () => {
    if(typeof player != "undefined"){
      this.x = (this.position[0] - player.position[0] + 5) * this.width;
      this.y = (this.position[1] - player.position[1] + 5) * this.height;
    }
  }
  draw = () => {
    let ctx = gamePlane.context;
    if (this.type == "floor") {
      var img = gamePlane.sprites.floors;
      ctx.drawImage(img, this.texture * 40, 0, 40, 40,
        this.x, this.y, 40, 40);
    }
    if (this.type == "stairs") {
      var img = gamePlane.sprites.stairs;
      ctx.drawImage(img, this.texture * 80, 0, 80, 80,
        this.x - 40, this.y - 40, 80, 80);
    }
    if (this.checked) {
      ctx.fillStyle = "rgba(255,0,0,0.3)";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}
class Text {
  constructor(w = gamePlane.width, h = 20, text = "") {
    this.w = w;
    this.h = h;
    this.text = text;
    this.oldText = "";
    this.showingLength = 25;
    this.showFPS = 0;
  }
  update() {
    if (this.text != "") {
      if (this.text == this.oldText) {
        this.showFPS++;
      } else {
        this.oldText = this.text;
        this.showFPS = 0;
      }
      let ctx = gamePlane.context;
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 0.8;
      ctx.font = '900 10px Tahoma';
      ctx.textAlign = "center";
      ctx.fillText(this.text, player.x, player.y + 230);
      ctx.strokeText(this.text, player.x, player.y + 230);
      if (this.showFPS >= this.showingLength) {
        this.text = "";
        this.showFPS = 0;
      }
    }
  }
}
class Action{  // class for hitText, Bullets,
  constructor(type,x,y,w,h,text){
    this.type = type;
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.text = text;
    this.showFPS = 0;
    this.showingLength = 150/gamePlane.fps;
    this.position = [this.x,this.y];
  }
  update(){
    this.showFPS++;
    let ctx = gamePlane.context;
    if(this.type == "hitText"){
      // set color
      if(this.text > 0){
        ctx.fillStyle = '#f00';
      }else{
        ctx.fillStyle = '#0f0';
      }
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.font = '900 12px Tahoma';
      ctx.textAlign = "center";
      const x = ((this.x - player.position[0] + 5) * 40) + 20;    
      const y = ((this.y - player.position[1] + 5) * 40) + 20  - (this.showFPS*2);  
      ctx.fillText(Math.abs(this.text), x, y);
      ctx.strokeText(Math.abs(this.text), x, y);
    }
    if(this.type == "bullet"){
      // draw bullet
      // console.log(this.y +" / "+this.x)
      var img = gamePlane.sprites.actions;
      ctx.drawImage(img, this.texture * 40, 0, 40, 40,
        this.x+200, this.y+200, 40, 40);
  
      // console.log("LECI");
      // ctx.beginPath();
      // ctx.rect(this.x+200, this.y+200, this.w, this.h);
      // ctx.strokeStyle = "red";
      // ctx.stroke();
    }

    if (this.showFPS >= this.showingLength) {
      for(const [i,h] of gamePlane.actions.entries()){
        if(h == this){
          gamePlane.actions.splice(i,1);
        }    
      }
    }
  }
}