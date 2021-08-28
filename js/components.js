class Creature {
  constructor(type,[x, y, z], pName){
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
    this.position = [x, y, z]; //x y z
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
    // CLEAR WHITE TARGET
    if(this.whiteTarget){
      let opp;
      let isOpp = false;
      for(const c of gamePlane.creatures.list){
        if(c.id == this.whiteTarget){
          isOpp = true;
          opp = c;
        }
      }
      if(isOpp){
        if(this.position[2] != opp.position[2]
          || Math.abs(this.position[1] - opp.position[1]) > 5
          || Math.abs(this.position[0] - opp.position[0]) > 5
        ){
          this.whiteTarget = false;
          controls.currentTarget = false;  
          this.redTarget = "clear";        
        }
      }
    }
    // DEATH
    if(this.health <= 0){
      this.cyle = 0;
      this.direction = 4;
      if(player.whiteTarget == this.id){
        player.whiteTarget = false;
      }
      this.redTarget = false;
      controls.currentTarget = false;
      controls.targeting('clear');
      controls.whiteTarget = false;
    }
    if(this.type != "player" && typeof player.position != null){
      this.x = (this.position[0] - player.position[0] + 5) * 40;
      this.y = (this.position[1] - player.position[1] + 5) * 40;  
    }
  }
  draw(zIndex = 0){
    // DRAW BY ZINDEX
    if(zIndex == this.position[2] && player.hideFloor != zIndex){
      let ctx = gamePlane.context;
      // draw target
      if( !map.hideFloor.includes(this.zIndex)){  
          // whiteTarget
          if(player.whiteTarget == this.id){
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
      // HEALING
      if(this.oldHealth < this.health){
        gamePlane.actions.push(new Action("misc",this.x,this.y,40,40,2));
      }
      // DISTANCE SHOT
      if(this.type == "player"){

        console.log(this.shotExhoust);      
      }

      if(this.shotExhoust > serv.time){
        if(isSet(this.shotBullet)){
          // get victim to set bullet end position
          let victim = false;
          for(const c of gamePlane.creatures.list){
            if(c.id == this.redTarget){
              victim = c;
            }
          }
          
          const bulletTime = this.shotExhoust - this.startBullet;
          const currentTime = this.shotExhoust - serv.time;
          // X POS
          const sX = this.shotPosition[0][0]; // start position
          let eX; // end position
          victim?eX=victim.position[0]:eX=this.shotPosition[1][0];

          const piece = 100 - Math.round((currentTime*100)/bulletTime);
          const dX = Math.abs(eX - sX); // distance X
          const bX =  ((dX*piece) / 100); // bullet x
          eX<sX?this.shotBullet.x=sX-bX:this.shotBullet.x=sX+bX;
          // Y POS
          const sY = this.shotPosition[0][1]; // start position
          // const eY = this.shotPosition[1][1]; // end position
          let eY; // end position
          victim?eY=victim.position[1]:eY=this.shotPosition[1][1];

          const dY = Math.abs(eY - sY); // distance X
          const bY =  ((dY*piece) / 100); // bullet x
          eY<sY?this.shotBullet.y=sY-bY:this.shotBullet.y=sY+bY;
          // console.log("sX:"+sX+", eX:"+eX+", dX:"+dX +", bX:"+bX +", piece:"+piece+", sB:"+this.shotBullet.x);
          this.shotBullet.update();
        }else{
          // first time
          this.shotBullet = new Action("bullet",this.position[0],this.position[1],10,10,1);
          this.startBullet = serv.time;
        }
      }else{
        if(typeof this.shotBullet != "undefined"){
          // last time
          gamePlane.actions.push(new Action("misc",this.shotPosition[1][0],this.shotPosition[1][1],40,40,1));
          delete this.shotBullet;
          delete this.startBullet;          
        }
      }
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
    // console.log("ee?")
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
    // console.log("ee?")
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
    let x = ((this.x - player.position[0] + 5) * 40);    
    let y = ((this.y - player.position[1] + 5) * 40);     
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
      x += 20;
      y += 20 - (this.showFPS*2);  
      ctx.fillText(Math.abs(this.text), x, y);
      ctx.strokeText(Math.abs(this.text), x, y);
    }
    if(this.type == "bullet"){
      // draw bullet
      var img = gamePlane.sprites.actions;
      ctx.drawImage(img, 3*40, this.text * 40, 40, 40,
      x, y, 40, 40);
      // ctx.beginPath();
      // ctx.rect(x, y, this.w, this.h);
      // ctx.strokeStyle = "red";
      // ctx.stroke();
    }
    if(this.type == "misc"){
      var img = gamePlane.sprites.actions;
      this.cyle = Math.round(this.showFPS);
      if(this.text != 1){x = this.x; y = this.y;}
      ctx.drawImage(img, this.cyle*40, this.text * 40, 40, 40,
      x, y, this.w, this.h); 
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