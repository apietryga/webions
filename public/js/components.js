class Creature {
  constructor(type,[x, y, z], pName,id){
    this.id = id;
    this.type = type;
    this.cyle = 0;
    this.name = pName;
    this.width = 40;
    this.height = 40;
    // this.sprite = "citizen"; 
    // this.img = map.sprites[this.sprite];
    this.hideFloor = "none";
    this.x = x ;
    this.y = y ;
    this.z = z;
    if(this.type == "player"){
      this.x = 200;
      this.y = 200;
    }
    // this.direction = 1;
    this.position = [x, y, z]; //x y z
    this.newPos =  equalArr(this.position);
    this.oldPos =  equalArr(this.position);
    this.bulletCyle = 0;
    this.targetlist = [];
    this.currentTarget = false;
    this.sendTarget = false;
    this.isTarget = false;
    this.currentExshoust = false;
    this.fistExhoust = 15;
  }
  update(){
    // ITEMS UPDATE
    if(this.type == "player" && typeof this.eq != "undefined"){
      // MENUS EQ UPDATE
      for(let key of Object.keys(this.eq)){
        // eq prewiev update
        const field = document.querySelector("."+key);
        if(this.eq[key] && field != null){
          if(field.innerHTML == "" || field.innerHTML == "&nbsp;"){
            field.innerHTML = "";
            const newItem = new Item(this.eq[key]);
            field.append(newItem.toDOM());
          }
        }else if(field != null){
          field.innerHTML = "";
        }
        // Backpack preview update
        // const square = document.querySelectorAll(".backpack .row >div");
        // if(key == "bp"){
        //   if(player.eq.bp){
        //     if(player.eq.bp.in && player.eq.bp.in.length > 0){
        //       // console.log(player.eq.bp.in.length)
        //       for(const [i,sq] of square.entries()){
        //         // sq.innerHTML = "";
        //         if(typeof player.eq.bp.in[i] != "undefined"
        //         && sq.innerHTML == ""){
        //           sq.append(this.toDOM(new Item(player.eq.bp.in[i])))
        //         }else{
        //           if(player.eq.bp.in.length < i){
        //             sq.innerHTML = "";
        //           }
        //         }
        //       }
        //       // for(const [i,inItem] of player.eq.bp.in.entries()){
        //         // clear square
        //         // square[i].innerHTML = "";
        //         // if(square[i].innerHTML == ""){
        //           // add item to square
        //           // square[i].append(this.toDOM(new Item(inItem)));
        //         // }else{
        //           // square[i].innerHTML = "";
        //         // }
        //       // }
        //     }else{
        //       // clear bp
        //       for(const s of square){s.innerHTML = "";}
        //     }
        //   }else{
        //       // clear bp
        //       for(const s of square){s.innerHTML = "";}
        //   }
        // } 
      }
    }
    // SPRITE LOAD & UPDATE
    if((["player","enemy"].includes(this.type) && (!isSet(this.img)) || isSet(this.outfitUpdate) )){
      if(isSet(this.outfitUpdate)){
        delete this.outfitUpdate;
      }
      this.img = map.sprites[this.sprite];
      if(typeof this.img != "undefined"){
        const recolor = recolorImage(this.img,this.colors);
        recolor.onload = () =>{
          this.img = recolor;
        }
      }
    }
    // WALKING
    if(this.walk >= serv.time){
      const walkTime = this.walk - this.walkingStart;
      const timeLeft = walkTime - (serv.time - this.walkingStart);
      // walking cyle (animation)
      timeLeft > walkTime/2?this.cyle = 2:this.cyle = 1;
      // monsers and npc's has 0 speed when stay.
      if(this.speed > 0){
        // CHANGE POSITION OF CREATURE
        const piece = 1 - Math.round((timeLeft/walkTime)*10)/10;
        this.position = equalArr(this.oldPos);
        for(let l of [[0,1],[1,0]]){
          if(this.newPos[2] != this.oldPos[2]){
            this.position = this.newPos;
          }
          if(this.newPos[l[0]] == this.oldPos[l[0]] ){
            if(this.newPos[l[1]] > this.oldPos[l[1]]){
              this.position[l[1]] = this.oldPos[l[1]] + piece;
            }else if(this.newPos[l[1]] < this.oldPos[l[1]]){
              this.position[l[1]] = this.oldPos[l[1]] - piece;
            }
          }
        }
      }else{
        // this.direction = 1;
        this.cyle = 0;
      }
    }else{
      if(this.sprite != "tourets"){
        this.cyle = 0;
      }
      this.position = this.newPos;
    }
    // CLEAR WHITE TARGET
    if(this.whiteTarget){
      let opp = false;
      // let isOpp = false;
      // console.log(gamePlane.creatures.list);
      for(const c of gamePlane.creatures.list){
        if(c.id == this.whiteTarget){
          // isOpp = true;
          opp = c;
        }
      }
      if(opp){
        if(this.position[2] != opp.position[2]
          || Math.abs(this.position[1] - opp.position[1]) > 5
          || Math.abs(this.position[0] - opp.position[0]) > 5
        ){
          this.whiteTarget = false;
          // controls.currentTarget = false;
          this.redTarget = "clear";        
        }
      }
    }
    // DEATH
    if(this.health <= 0){
      if(this.sprite!= "tourets"){
        this.cyle = 0;
      }
      this.direction = 4;
      if(player.whiteTarget == this.id){
        player.whiteTarget = false;
        // controls.targeting('clear');
    }
      this.redTarget = false;
      // controls.currentTarget = false;
      // controls.targeting('clear');
      controls.whiteTarget = false;
      // if(this.name == player.name){
      //   gamePlane.stop("You are dead.");
      // }
    }
    // SET VISIBLE FLOOR
    if(this.type == "player"){
      // check windows around
      let isWindow = false;
      const z = player.newPos[2];
      const checkIfWindows = [
        [player.newPos[0],player.newPos[1]-1],
        [player.newPos[0],player.newPos[1]+1],
        [player.newPos[0]-1,player.newPos[1]],
        [player.newPos[0]+1,player.newPos[1]]
      ];
      for(const ch of checkIfWindows){
        for(const g of map.getGrid([ch[0],ch[1],z])){
          if(g[4] == "windows"){
            isWindow = true;
          }
        }  
      }
      // if player is under ground
      if(this.position[2] < 0){
        map.visibleFloor = z;
      // if is something above player [level up]
      }else if(map.getGrid([this.newPos[0],this.newPos[1],this.newPos[2]+1])[0]){
        map.visibleFloor = z;
      // if is something above player [2 level up]
      }else if(map.getGrid([this.newPos[0],this.newPos[1],this.newPos[2]+2])[0]){
        map.visibleFloor = z+1;
      // if player is near window
      }else if(isWindow){
        map.visibleFloor = z;
      }else{
        map.visibleFloor = map.maxFloor;
      }
    }
    // SET OTHER CREATURES DEPENDS OF PLAYER POSITION
    if(this.type != "player" && typeof player.position != null){
      this.x = (this.position[0] - player.position[0] + 5) * 40;
      this.y = (this.position[1] - player.position[1] + 5) * 40;  
    }
  }
  draw(){
    let ctx = gamePlane.context;
 
    // SAYING
    if(this.name == player.name){
      // RENDER ALL SAYS NEAR
      for(const creature of gamePlane.creatures.list){
        // console.log(creature);
        if(isSet(creature.says) && creature.says != ""){
          // console.log(creature.says)
          if(["player","enemy"].includes(creature.type)){
            menus.console.log(creature.name+"["+creature.skills.level+"]: "+creature.says);
          }else if(creature.type == "npc"){
            menus.console.log(creature.name+": "+creature.says);
          }
          gamePlane.actions.push(new Action("says",creature.position[0],creature.position[1],100,200,[creature.name,creature.says],900));
          delete creature.says;
        }
      }
    }
    // draw half of whiteTarget
    if(player.whiteTarget == this.id){
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.moveTo(this.x +3,this.y + 37);
      ctx.lineTo(this.x +3, this.y);
      ctx.lineTo(this.x +38, this.y);
      ctx.stroke();
    }
    // draw fist half of redTarget
    if(this.id == player.redTarget & this.health > 0){
      ctx.beginPath();
      ctx.fillStyle = "red";
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 3;
      ctx.moveTo(this.x,this.y + 41.5);
      ctx.lineTo(this.x, this.y-3);
      ctx.lineTo(this.x +41.5, this.y-3);
      ctx.stroke();  
    }
    // draw sprite
    if(this.position[2] <= map.visibleFloor){
      if(["player","enemy"].includes(this.type)){
          // draw colors masks
          const cw = this.img.width/6;
          ctx.drawImage(
            this.img, (this.cyle+3) * cw, this.direction * cw, cw, this.img.height/5,
            this.x - 40, this.y-40, 100, 100
          );
          // draw else elements xD
          ctx.drawImage(
            this.img, this.cyle * cw, this.direction * cw, cw, this.img.height/5,
            this.x - 40, this.y-40, 100, 100
          );
      }else{
        const img = map.sprites[this.sprite];
        ctx.drawImage(
          img, this.cyle * img.width/3, this.direction * img.width/3, img.width/3, img.height/5,
          this.x - 40, this.y-40, 100, 100
        );
      }
    }
    // draw second half of whiteTarget
    if(player.whiteTarget == this.id){
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.moveTo(this.x + 1.5 ,this.y + 37);
      ctx.lineTo(this.x + 37, this.y +37);
      ctx.lineTo(this.x + 37, this.y);
      ctx.stroke();
    }  
    // draw second half of redTarget
    if(this.id == player.redTarget & this.health > 0){
      ctx.beginPath();
      ctx.fillStyle = "red";
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 3;
      ctx.moveTo(this.x  ,this.y + 40);
      ctx.lineTo(this.x + 40, this.y + 40);
      ctx.lineTo(this.x + 40, this.y -1);
      ctx.stroke();  
    }
    // draw name and health bar & update mana bar
    if(this.health > 0 && this.position[2] == player.position[2]){
      // menus health bar update
      let maxBarWidth = 28;
      let barWidth = (maxBarWidth * this.health) / this.totalHealth;
      let percHealth = (100 * this.health) / this.totalHealth;
        
      // UPDATE DOM BARS IN MENUS
      if(this.type == "player"){
        // barWidth = (maxBarWidth * this.health) / this.totalHealth;
        // percHealth = (100 * this.health) / this.totalHealth;
        for(const key of ["healthBar","manaBar"]){
          const DOMBar = document.querySelector("."+key);
          if(DOMBar != null && DOMBar.style.display != "none"){
           if(key == "healthBar"){
              DOMBar.querySelector("div").style.width = percHealth+"%";
              DOMBar.querySelector("div").style.backgroundColor = hpColor(percHealth>75?75:percHealth);
              DOMBar.querySelector("label").innerHTML = this.health+"/"+this.totalHealth;
            }else{
              const percMana = (100 * this.mana) / this.totalMana;
              DOMBar.querySelector("div").style.width = percMana+"%";
              DOMBar.querySelector("div").style.backgroundColor = 'blue';
              DOMBar.querySelector("label").innerHTML = this.mana+"/"+this.totalMana;  
            }
          }
        }
      }
      // CANVAS RENDER
      ctx.fillStyle = hpColor(percHealth);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1.5;
      ctx.font = '900 20px Tahoma';
      ctx.textAlign = "center";
      ctx.fillText(this.name, this.x + 5, this.y - 22);
      ctx.strokeText(this.name, this.x + 5, this.y - 22);
      ctx.beginPath();
      ctx.rect(this.x - 11, this.y - 18, 30, 5);
      ctx.fillRect(this.x - 10, this.y - 17, barWidth, 3);
      ctx.stroke();
    }
    // draw hits and healing value
    if(isSet(this.oldHealth) && this.oldHealth != this.health){
      const hitValue = this.oldHealth - this.health;
      gamePlane.actions.push(new Action("hitText",this.position[0],this.position[1],100,200,hitValue));
    }
    // draw exp value     
    if(isSet(this.skills) && isSet(this.skills.oldExp) && this.skills.exp != this.skills.oldExp && this.type == "player"){
      const expValue = this.skills.exp - this.skills.oldExp;
      gamePlane.actions.push(new Action("expText",this.position[0],this.position[1],100,200,expValue));
      this.skills.oldExp = this.skills.exp;
    }
    // drav level promotion
    if(isSet(this.skills) &&isSet(this.skills.oldLvl) && this.skills.level != this.skills.oldLvl && this.type == "player"){
      if(this.skills.oldLvl != 0){
        gamePlane.actions.push(new Action("centerTxt",this.position[0],this.position[1],100,200,this.skills.level,3000));
      }
      this.skills.oldLvl = this.skills.level;
    }
    // HEALING amount
    if(this.oldHealth < this.health){
      gamePlane.actions.push(new Action("misc",this.x,this.y,40,40,2));
    }
    // DISTANCE SHOT
    if(this.bulletOnTarget >= serv.time){
      if(isSet(this.shotBullet)){
        // get victim to set bullet end position
        for(const c of gamePlane.creatures.list){
          if(c.id == this.shotTarget){
            this.shotVictim = c;
          }
        }
        const piece = 100 - Math.round(((this.bulletOnTarget - serv.time)*100)/(this.bulletOnTarget - this.startBullet));
        if(isSet(this.shotVictim)){
          // X POS
          const pX = ((Math.abs(this.shotVictim.position[0] - this.position[0])*piece) / 100);
          this.shotVictim.position[0]<this.position[0]?this.shotBullet.x=this.position[0]-pX:this.shotBullet.x=this.position[0]+pX;
          // Y POS
          const pY = ((Math.abs(this.shotVictim.position[1] - this.position[1])*piece) / 100);
          this.shotVictim.position[1]<this.position[1]?this.shotBullet.y=this.position[1]-pY:this.shotBullet.y=this.position[1]+pY;
          this.shotBullet.update();
        }
      }else{
        // first time
        this.shotBullet = new Action("bullet",this.position[0],this.position[1],10,10,1);
        this.startBullet = serv.time;
      }
    }else{
      // last bullet
      if(typeof this.shotBullet != "undefined" && typeof this.shotVictim != "undefined"){
        gamePlane.actions.push(new Action("misc",this.shotVictim.position[0],this.shotVictim.position[1],40,40,1));
        delete this.shotBullet;
        delete this.startBullet;
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
    this.cyle = 0;
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
  draw = (plr = {}) => {
    // for compatibility with mapeditor && gamePlane
    let phantomPlayer = (typeof player === 'undefined')?plr:player; 
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const w = (typeof map.sprites[this.type] != "undefined")?map.sprites[this.type].dataset.w:40;
    if(this.type == 'doors' && compareTables(this.position,phantomPlayer.newPos)){
      this.cyle = 1;
    }
    if(this.type != 'delete'){
      ctx.drawImage(map.sprites[this.type],
      this.texture * w, this.cyle*w, w, w,
      (this.position[0] - phantomPlayer.position[0] + 6)*40-w, (this.position[1] - phantomPlayer.position[1] + 6)*40-w, w, w);
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
      ctx.lineWidth = 1.5;
      ctx.font = '900 20px Tahoma';
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
  constructor(type,x,y,w,h,text,length = 150){
    this.type = type;
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.text = text;
    this.showFPS = 0;
    this.showingLength = Math.floor(length/gamePlane.fps);
    this.position = [this.x,this.y];
    if(this.type == "says"){
      this.text = text;
    }
  }
  update(){
    this.showFPS++;
    let ctx = gamePlane.context;
    let x = ((this.x - player.position[0] + 5) * 40);    
    let y = ((this.y - player.position[1] + 5) * 40);     
    if(this.type == "says"){
      // set color
      ctx.fillStyle = '#ff0';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.font = '900 15px Tahoma';
      ctx.textAlign = "center";
      const lineHeight = 15;
      y = y-20;
      const text = this.text[0]+" says: \n"+this.text[1];
      for(const [i,line] of text.split("\n").entries()){
        ctx.fillText(line, x, y + (i*lineHeight));
        ctx.strokeText(line, x, y + (i*lineHeight));
      }
    }
    if(this.type == "hitText"){
      // set color
      if(this.text > 0){
        ctx.fillStyle = '#f00';
      }else{
        ctx.fillStyle = '#0f0';
      }
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.font = '900 15px Tahoma';
      ctx.textAlign = "center";
      x += 20;
      y += 20 - (this.showFPS*2);  
      ctx.fillText(Math.abs(this.text), x, y);
      ctx.strokeText(Math.abs(this.text), x, y);
    }    
    if(this.type == "expText"){
      // set color
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.font = '900 15px Tahoma';
      ctx.textAlign = "center";
      x += 20;
      y += 20 - (this.showFPS*2);  
      ctx.fillText(Math.abs(this.text), x, y);
      ctx.strokeText(Math.abs(this.text), x, y);
    }
    if(this.type == "bullet"){
      // draw bullet
      var img = map.sprites.actions;
      ctx.drawImage(img, 3*40, this.text * 40, 40, 40,
      x, y, 40, 40);
    }
    if(this.type == "misc"){
      var img = map.sprites.actions;
      this.cyle = Math.round(this.showFPS);
      if(this.text != 1){x = this.x; y = this.y;}
      ctx.drawImage(img, this.cyle*40, this.text * 40, 40, 40,
      x, y, this.w, this.h); 
    }
    if(this.type == "centerTxt"){
      this.showingLength = 450/gamePlane.fps;
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      const fontSize = 15;
      ctx.font = '900 '+fontSize+'px Tahoma';
      ctx.textAlign = "center";
      x = (gamePlane.canvas.width/2);
      y = (gamePlane.canvas.width/2);  
      ctx.fillText("You advanced to level "+this.text+".", x, y);
      ctx.strokeText("You advanced to level "+this.text+".", x, y);
    }
    if (this.showFPS >= this.showingLength) {
      for(const [i,h] of gamePlane.actions.entries()){
        if(h == this){
          gamePlane.actions.splice(gamePlane.actions.indexOf(i),1);
        }    
      }
    }
  }
}
const imgQuene = [];
class Item{
  constructor(obj){
    // MAKE ITEM FROM OBJ
    this.type = "item";
    for(const key of Object.keys(obj)){
      this[key] = obj[key];
    }
    // console.log(this)
    // this.addEventListener(mobileControls.ev,()=>{
    //   console.log(this)
    // })
  }
  toDOM(){
    const item = this;
    const sq = document.createElement("canvas");
    for(const k of Object.keys(item)){
      sq[k] = item[k];
    }
    sq.className = "itemDOM";
    const img = map.sprites[item.sprite];
    sq.width = img.height;
    sq.height = img.height;
    const ctx = sq.getContext("2d");
    ctx.drawImage(img, 
      item.spriteNr * img.height, 0, img.height, img.height,
      0, 0, img.height, img.height
    );
    // Item's skills preview
    let dataset = "<b>"+sq.name+"</b><br />";
    for(const key of Object.keys(item)){
      if(['def','speed','health','mana','manaRegen','fist','dist','atk'].includes(key)){
        dataset += key+": "+item[key]+'<br />';
      }
    }
    sq.onclick = () => {
      if(sq.classList.contains("picked")){
        sq.classList.remove("picked");
        menus.mainMenu.twiceClick(item,sq.parentElement);
      }else{
        // clear picked class
        for(const p of document.querySelectorAll(".picked")){
          p.classList.remove("picked");
        }
        sq.classList.add("picked");
      }
    }

    const itemContainer = document.createElement("div");
    itemContainer.className = "itemContainer";

    const label = document.createElement("div");
    label.className = "label";
    label.innerHTML = dataset;
    itemContainer.append(label);
    itemContainer.append(sq);

    return itemContainer;
  }
  update(){
    // console.log("update...")
  }
  draw(){
     // CANVAS ITEM
     if(isSet(this.position) && this.position[2] <= map.visibleFloor){
      const ctx = gamePlane.context;
      const img = map.sprites[this.sprite];
      // console.log(img);
      // console.log(this.sprite)
      let w = img.height;
      let x = ((this.position[0] - player.position[0] + 5) * 40 - w)+40;    
      let y = ((this.position[1] - player.position[1] + 5) * 40 - w)+40;     
      ctx.drawImage(img, this.spriteNr * img.height, 0, img.height, img.height,
        x, y, w, w
      );
    }
  }
}