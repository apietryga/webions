class Grid {
  constructor(t) {
    if (typeof t[4] == "undefined") { t[4] = "floor"; }
    this.texture = t[0];
    this.position = [t[1], t[2], t[3]];
    this.type = t[4];
    this.width = game.square;
    this.height = game.square;
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
    if(typeof player != "undefined"){
      this.x = (this.position[0] - player.position[0] + Math.floor( game.mapSize[0] / 2 )) * this.width;
      this.y = (this.position[1] - player.position[1] + Math.floor( game.mapSize[1] / 2 )) * this.height;
    }
  }
  draw = (plr = {}) => {
    // for compatibility with mapeditor && gamePlane
    let phantomPlayer = (typeof player === 'undefined')?plr:player; 
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const w = (typeof map.sprites[this.type] != "undefined")?map.sprites[this.type].dataset.w:game.square;
    if(this.type == 'doors' && compareTables(this.position,phantomPlayer.newPos)){
      this.cyle = 1;
    }
    if(this.type == "mwalls"){
      if(serv.time %2 == 0){
        this.cyle = 1;
      }else{
        this.cyle = 0;
        
      }
    }
    if(this.type != 'delete'){
      if(typeof map.sprites[this.type] != 'undefined'){
        ctx.drawImage(map.sprites[this.type],
          this.texture * w, this.cyle*w, w, w,
          ( this.position[0] - phantomPlayer.position[0] + Math.ceil( game.mapSize[0]/2 ) ) * game.square - w, 
          ( this.position[1] - phantomPlayer.position[1] + Math.ceil( game.mapSize[1]/2 ) ) * game.square - w, w, w
        );
      }
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
      const fontSize = 20;
      let ctx = gamePlane.context;
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1.5;
      ctx.font = '900 ' + fontSize + 'px Tahoma';
      ctx.textAlign = "center";
      ctx.fillText(this.text, player.x, player.y + game.square * Math.ceil( game.mapSize[1] / 2 ) - ( fontSize / 2 ) );
      ctx.strokeText(this.text, player.x, player.y + game.square * Math.ceil( game.mapSize[1] / 2 ) - ( fontSize / 2 ) );
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
    let x = (( this.x - player.position[0] + Math.floor( game.mapSize[0] / 2 )) * game.square);
    let y = (( this.y - player.position[1] + Math.floor( game.mapSize[1] / 2 )) * game.square);
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
      ctx.drawImage(img, 3*game.square, this.text * game.square, game.square, game.square,
      x, y, game.square, game.square);
    }
    if(this.type == "misc"){
      var img = map.sprites.actions;
      this.cyle = Math.round(this.showFPS);
      if(this.text != 1){x = this.x; y = this.y;}
      ctx.drawImage(img, this.cyle*game.square, this.text * game.square, game.square, game.square,
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

    // SPRITES FOR COINS
    if(this.sprite == "coins"){
      // GOLD COINS
      if(this.amount  == 1 ){
        this.spriteNr = 0;
      }else if( this.amount <= 2){
        this.spriteNr = 1;
      }else if(this.amount < 10){
        this.spriteNr = 2;
      }else if(this.amount < 30){
        this.spriteNr = 3;
      }else if(this.amount < 50){
        this.spriteNr = 4;
      }else if(this.amount < 100){
        this.spriteNr = 5;

      // PLATINIUM COINS
      }else if(this.amount  == 100 ){
        this.spriteNr = 6;
      }else if(this.amount  <= 200 ){
        this.spriteNr = 7;
      }else if( this.amount < 1000){
        this.spriteNr = 8;
      }else if(this.amount < 3000){
        this.spriteNr = 9;
      }else if(this.amount < 5000){
        this.spriteNr = 10;
      }else if(this.amount < 10000){
        this.spriteNr = 11;

        // PLATINIUM COINS
      }else if(this.amount == 10000){
        this.spriteNr = 12;
      }else if(this.amount  <= 20000 ){
        this.spriteNr = 13;
      }else if(this.amount  < 100000 ){
        this.spriteNr = 14;
      }else if( this.amount < 300000){
        this.spriteNr = 15;
      }else if(this.amount < 50000){
        this.spriteNr = 16;
      }else{
        this.spriteNr = 17;
      }
    }
  }
  toDOM(){
    const item = this;
    // const item = new Item(this);
    const sq = document.createElement("canvas");
    for(const k of Object.keys(item)){
      sq[k] = item[k];
    }
    sq.className = "itemDOM";
    const img = map.sprites[item.sprite];
    if(!img){ return }

    const height = img?.height;

    sq.width = height;
    sq.height = height;

    const ctx = sq.getContext("2d");
    // ctx.clearRect(0, 0, img.width, img.height);
    // console.log("img", img, "height", height)
    
    ctx.drawImage(img, 
      item.spriteNr * height, 0, height, height,
      0, 0, height, height
    );

    const itemContainer = document.createElement("div");
    itemContainer.className = "itemContainer";
    
    // ITEMS WITH AMOUNT
    if(isSet(this.amount)){
      itemContainer.dataset.amount = this.amount;
      ctx.fillStyle = '#fff';
      ctx.lineWidth = 0.5;
      ctx.font = 'game.square0 15px Tahoma';
      ctx.textAlign = "right";

      let showingAmount = 100;
      if(item.amount < 100){
        showingAmount = item.amount;
      }else if(item.amount < 10000){
        showingAmount = item.amount/100;
      // }else if(item.amount < 1000000){
      }else{
        showingAmount = item.amount/10000;
      }
      ctx.fillText(showingAmount, 32, 32);
    }
    
    this.dom = sq;
    sq.onclick = () => {
      if(sq.classList.contains("picked")){
        sq.classList.remove("picked");
        // menus.mainMenu.twiceClick(item,sq.parentElement);
        menus.mainMenu.twiceClick(item);
      }else{
        // clear picked class
        for(const p of document.querySelectorAll(".picked")){
          p.classList.remove("picked");
        }
        sq.classList.add("picked");
      }
    }
    // Item's skills preview
    const label = document.createElement("div");
    label.className = "label";
    label.innerHTML = "";
    for(const key of Object.keys(item)){
      if(['name','def','speed','health','mana','manaRegen','fist','dist','atk','amount'].includes(key)){
        const wrapper = document.createElement("div");
        wrapper.style.cssText = "display:flex;align-items:center;"
        if(key != 'name'){
          wrapper.append(sign.render(key));
        }
        wrapper.innerHTML += "<span style='flex:1;text-align:center'>"+item[key]+"</span>";
        label.append(wrapper)
      }
    }
    itemContainer.append(label);
    itemContainer.append(sq);
    return itemContainer;
  }
  update(){
    // update items on floor.
  }
  draw(){
     // CANVAS ITEM
     if(isSet(this.position) && this.position[2] <= map.visibleFloor && isSet(map.sprites[this.sprite])){
      const ctx = gamePlane.context;
      const img = map.sprites[this.sprite];

      let isTable = false;
      if(this.name != "Table"){
        for(const item of gamePlane.items){
          if(compareTables(item.position, this.position) && item.name == "Table"){
            isTable = true;
            break;
          }
        }
      }

      let w = img.height;
      let x = ((this.position[0] - player.position[0] + Math.floor( game.mapSize[0] / 2 )) * game.square - w) + game.square;    
      let y = ((this.position[1] - player.position[1] + Math.floor( game.mapSize[1] / 2 )) * game.square - w) + game.square;   

      // change position if item say on table
      if(isTable){
        x -= 20;
        y -= 15;
      }

      ctx.drawImage(img, this.spriteNr * img.height, 0, img.height, img.height,
        x, y, w, w
      );
    }
  }
}