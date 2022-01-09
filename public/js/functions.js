this.compareTables = (a,b) =>{
  let result = true;
  for(i = 0; i < a.length; i++){    
    if( a[i] != b[i] ){
      result = false;
    }
  }
  return result;
}
this.indexOfArr = (parent,arr) => {
  let isThis = true;
  for(const [i,p] of parent.entries()){
    isThis = true;
    for(const [l,s] of p.entries()){
      if(s != arr[l]){isThis = false;}
    }
    if(isThis){return i;}
  }
  if(!isThis){return -1;}
}
this.equalArr = (arr) => {
  let newArr = [];
  for(a = 0; a < arr.length; a++){
    newArr[a] = arr[a];
  }
  return newArr;
}
this.includesArr = (searchThis,inThis) => {
  let result = false;
  for(iT of inThis){
    for(x = 0; x < iT.length; x++){
      if(iT[0] == searchThis[0] 
      && iT[1] == searchThis[1] 
      && iT[2] == searchThis[2]){
        result = true;
      } 
    }
  }
 return result; 
}
this.setRoute = (sPos,fPos,map,creatures = [],possibilities = 200, mwalls = []) => {
  const posibleRoutes = [[[sPos[0],sPos[1]]]];
  let routeFinded = false;
  for(const route of posibleRoutes){
    const lastG = this.equalArr(route[route.length-1]);lastG.push(sPos[2]);  
    // GET POSSIBLE GRIDS AROUND
    const gridsAround = [];
    for(let d = 0; d < 4; d++){
      let [pX,pY] = lastG;
      if(d == 0){pX++;}if(d == 1){pX--;}if(d == 2){pY++;}if(d == 3){pY--;}
      let isFloor = false;
      let isWall = false;
      let someBodyIsThere = false;
      for(const g of map.getGrid([pX,pY,sPos[2]])){
        if((map.avalibleGrids.includes(g[4])) && !this.includesArr([pX,pY],gridsAround)){
          // check if someone stay there
          isFloor = true;
          for(const c of creatures){
            if(this.compareTables(c.position,[pX,pY,sPos[2]]) && c.health > 0){
              someBodyIsThere = true;
              break;
            }
          }
        }
        if(map.notAvalibleGrids.includes(g[4])){
          isWall = true;
          break;
        }
      }
      // check mwalls
      for(const mwall of mwalls){
        if(this.compareTables([pX,pY,sPos[2]],[mwall[0],mwall[1],mwall[2]])){
          isWall = true;
          break;
        }
      }
      

      if(!someBodyIsThere && isFloor && !isWall){
        gridsAround.push([pX,pY]);
      }
    }    
    // SET POSSIBLE ROUTES    
    const clearRoute = []; // route with one step.
    for(const [l,g] of gridsAround.entries()){ // i - index of grid in step
      clearRoute[l] = this.equalArr(route);
      clearRoute[l].push(g);
      posibleRoutes.push(clearRoute[l]);
      if(Math.abs(g[0] - fPos[0]) < 2 && Math.abs(g[1] - fPos[1]) < 2){
        routeFinded = clearRoute[l]; break;
      }
    }
    // GO OUT, WHEN FIND ROUTE OR IT TAKES TOO LONG
    if(routeFinded || posibleRoutes.length > possibilities){break;}
  }
  if(routeFinded){routeFinded.shift();}
  return routeFinded;
}
this.isSet = (val) => {
  let result = false;
  if(typeof val != "undefined"){
    result = true;
  }
  return result;
}
this.setTotalVals = (where) => {
  where.totalHealth = where.maxHealth;
  if(where.type == "player"){
    where.totalSpeed = where.speed;
    where.totalDef = where.skills.def;
    where.totalFist = where.skills.fist;
    where.totalDist = where.skills.dist;
    where.totalMana = where.maxMana;
    where.totalManaRegen = where.manaRegenValue;
    if(this.isSet(where.eq)){
      for(const key of Object.keys(where.eq)){
        if(where.eq[key]){
          if(this.isSet(where.eq[key].speed)){where.totalSpeed += where.eq[key].speed;}
          if(this.isSet(where.eq[key].def)){where.totalDef += where.eq[key].def;}
          if(this.isSet(where.eq[key].health)){where.totalHealth += where.eq[key].health;}
          if(this.isSet(where.eq[key].mana)){where.totalMana += where.eq[key].mana;}
          if(this.isSet(where.eq[key].manaRegen)){where.totalManaRegen += where.eq[key].manaRegen;}
          if(this.isSet(where.eq[key].fist)){where.totalFist += where.eq[key].fist;}
          if(this.isSet(where.eq[key].dist)){where.totalDist += where.eq[key].dist;}
        }
      }
    }
  }
}
this.getNamesFromObjArr = (objArr) => {
  const result = [];
  for(const obj of objArr){
    if(typeof obj.name != 'undefined'){
      result.push(obj.name);
    }
  }
  return result;  
}
this.validateNick = (nick, forbiddenNicks) => {
  if(nick.split("+").length > 2){
    nick = nick.replace(/[+]/g, ' ');
  }else{
    nick = nick.replace('+',' ');
  }
  if(/\d/.test(nick)){return [false, 'Nick cannot contains numbers']}
  if(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(nick)){return [false, 'Nick contains illegal chars']}
  for(const fNick of forbiddenNicks){
    if(fNick == nick){
      return [false,"This nickname is forbidden"];
    }
  }  
  return [true, nick];
}
this.isPos = () =>{
  // SET DROPPING FLOOR [WHEN DROP IS BETWEEN FLOORS]
  for(let floor = this.visibleFloor; floor >= map.minFloor; floor--){
    const checkPosition = [this.position[0],this.position[1],floor];
    for(const grid of map.getGrid(checkPosition)){
      if(grid[4] == "floors"){
        isPos = true;
        this.position = checkPosition;
        break;
      }
    }
    if(isPos){return isPos;} 
  }
  return false;
}
function recolorImage(img, fresh = {head:[50,50,50],chest:[50,50,50],legs:[50,50,50],foots:[50,50,50]}){
  if(!isSet(img)){return 0;}
  const c = document.createElement('canvas');
  const ctx = c.getContext("2d");
  const w = img.width;
  const h = img.height;
  c.width = w;
  c.height = h;
  ctx.drawImage(img, 0, 0, w, h);
  const imageData = ctx.getImageData(0, 0, w, h);
  const base = {
    head : [255,255,0],
    chest : [255,0,0],
    legs : [0,255,0],
    foots : [0,0,255]
  }
  for(let i=0; i < imageData.data.length; i += 4){
    for(const b of Object.keys(base)){
      if(
        imageData.data[i]   == base[b][0] &&
        imageData.data[i+1] == base[b][1] &&
        imageData.data[i+2] == base[b][2]
     ){
       imageData.data[i]  = fresh[b][0];
       imageData.data[i+1]= fresh[b][1];
       imageData.data[i+2]= fresh[b][2];
     }
    }
  }
  ctx.putImageData(imageData,0,0);
  let result = document.createElement("img");
  result.src = c.toDataURL('image/png');
  return result;
}
function everyInterval(n){
  if((gamePlane.frameNo/n) % 1 == 0){return true;}
  return false;
}
function setResolution(){
  mobileControls.validate();  
  menus.resize();
}
function hpColor(perc){
  let green = Math.round((255*perc)/100);
  let red = 255-green;
  if(perc < 5){red = 0;}
  return "rgb("+red+","+green+",0)";  
}
function checkClick(event) {
  let clickX = event.layerX;
  let clickY = event.layerY;
  let element = false;

  let buttons;
  if(event.target.classList.contains("rightBar")){
     buttons = mobileControls.rightButtons.buttons;
  }else if(event.target.classList.contains("leftBar")){
    buttons = mobileControls.leftButtons.buttons;
  }
  buttons.forEach((b) => {
    if (
      clickX > b.x &&
      clickX < (b.x + b.w) &&
      clickY > b.y &&
      clickY < (b.y + b.h)
    ) {
      element = b.keyCode;
    }
  });
  return element;
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function delete_cookie(name) {
  if( get_cookie( name ) ) {
    document.cookie = name + "= '';expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
}
function get_cookie(name){
  return document.cookie.split(';').some(c => {
      return c.trim().startsWith(name + '=');
  });
}
// signs for health, manaRegen etc.
const sign = {
  names: ['fist','dist','mana','manaRegen','def','health','healing','speed','exp'],
  render(name, opt = { size : 25, margin: 'auto'}){
    if(this.names.includes(name)){
      this.dom = document.createElement("div");
      this.dom.className = "itemContainer";
      this.dom.style.cssText = `
        width:${opt.size}px;
        height:${opt.size}px;
        background-image: url(./img/signs.svg);
        background-size:auto 100%;
        margin:${opt.margin};
        background-position: -${ (opt.size) * this.names.indexOf(name)}px 0;
      `;  
      const label = document.createElement("div");
      label.className = "label";
      label.innerHTML = name;
      this.dom.append(label);
      return this.dom;
    }else{
      return name;
    }
  }
}
