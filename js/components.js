class Creature {
  constructor(type,x, y, z, pName){
    this.type = type;
    this.cyle = 0;
    // this.lastCyle = 0;
    this.name = pName;
    this.width = 40;
    this.height = 40;
    this.sprite = 'citizen'; 
    this.speed = 10;
    this.x = x ;
    this.y = y ;
    this.z = z;
    this.walking = 0;
    if(this.type == "player"){
      this.x = 200;
      this.y = 200;
    }
    this.direction = 1;
    this.position = [x, y, this.z]; //x y z
    this.realPos = this.position;
    this.oldPos = this.position;
    this.phantomPos = equalArr(this.position);
    this.walkFps = 0;
    this.roznicaX = 0;
    this.roznicaY = 0;
    this.health = 1000;
    this.maxHealth = 1000;
    this.targetlist = [];
    this.currentTarget = false;
    this.isTarget = false;
    this.currentExshoust = false;
    this.fistExhoust = 15;
  }
  update(){
    let directions = [[3, 2],[0,1]];
    // walking animation and positions
    if(this.walk >= serv.time){
      this.cyle = ((this.cyle )%2)+1;
      let piece = Math.round(((this.walk - serv.time)*100)/(this.walk-this.walkStart))/100;
      // for x and y 
      for(let l of [[0,1],[1,0]]){       
        if(this.position[l[0]] == this.oldPos[l[0]] ){
          if(this.position[l[1]] > this.oldPos[l[1]]){
            this.position[l[1]] = this.oldPos[l[1]] + piece;
            this.direction = directions[l[1]][0];
          }else if(this.position[l[1]] < this.oldPos[l[1]]){
            this.position[l[1]] = this.oldPos[l[1]] - piece;
            this.direction = directions[l[1]][1];
          }
          this.position[l[1]] = Math.round(this.position[l[1]]*10)/10;
        }else{
          if(this.position[l[1]] != this.oldPos[l[1]]){
            this.position = this.realPos;
          }
        }
      }
    }else{
      this.cyle = 0;
    }

    // player death
    if(this.health <= 0){
      this.die();
    }
    if(this.currentTarget){
      this.attack();
    }
    if(this.type != "player"){
      this.x = (this.position[0] - player.position[0] + 5) * 40;
      this.y = (this.position[1] - player.position[1] + 5) * 40;  
    }
    this.draw();
  }
  draw(){
    let ctx = gamePlane.context;
    // draw target
    if(this.type != "player" && !map.hideFloor.includes(this.zIndex)){
        if(this.onTarget){
          ctx.beginPath();
          ctx.fillStyle = "red";
          ctx.strokeStyle = 'red';
          ctx.lineWidth = 3;
          ctx.rect(this.x, this.y, this.w, this.h);
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
      ctx.lineWidth = 0.8;
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
    this.x = (this.position[0] - player.position[0] + 5) * this.width;
    this.y = (this.position[1] - player.position[1] + 5) * this.height;
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
  update = () => {
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
