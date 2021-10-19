let bcrypt;if(typeof window == "undefined"){bcrypt = require('bcrypt');}
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
this.setRoute = (sPos,fPos,map,creatures = [],possibilities = 200) => {
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
          for(const c of creatures){if(this.compareTables(c.position,[pX,pY,sPos[2]]) && c.health > 0){
            someBodyIsThere = true;
          }}
        }
        if(map.notAvalibleGrids.includes(g[4])){
          isWall = true;
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
    // console.log();
    result = true;
  }
  return result;
}
this.cryptPassword = function(password, callback) {
  bcrypt.genSalt(10, function(err, salt) {
   if (err) 
     return callback(err);

   bcrypt.hash(password, salt, function(err, hash) {
     return callback(err, hash);
   });
 });
};
this.comparePassword = function(plainPass, hashword, callback) {
  bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch) {   
      return err == null ?
          callback(null, isPasswordMatch) :
          callback(err);
  });
};




function everyInterval(n){
  if((gamePlane.frameNo/n) % 1 == 0){return true;}
  return false;
}
function setResolution(){
  let gP = document.querySelector(".gamePlane");
  let unit = "vh";
  if(window.innerHeight > window.innerWidth){
    unit = "vw";
  }
  gP.style.width = "100"+unit;
  gP.style.height = "100"+unit;
  // console.log("Resolution set.");
  document.querySelector(".loadDetails").innerHTML = "Setting resolution ...";
  mobileControls.validate();
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