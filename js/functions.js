this.compareTables = (a,b) =>{
  let result = true;
  for(i = 0; i < a.length; i++){    
    if( a[i] != b[i] ){
      result = false;
    }
  }
  return result;
}

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
function equalArr(arr){
  let newArr = [];
  for(a = 0; a < arr.length; a++){
    newArr[a] = arr[a];
  }
  return newArr;
}
function includesArr(searchThis,inThis){
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
function isSet(val){
  let result = false;
  if(typeof val != "undefined"){
    // console.log();
    result = true;
  }
  return result;
}

// MOBILE CONTROLS
function absorbEvent_(event) {
  // var e = event || window.event;
  // e.preventDefault && e.preventDefault();
  // e.stopPropagation && e.stopPropagation();
  // e.cancelBubble = true;
  // e.returnValue = false;
  return false;
}
function initPreventing() {
  // preventLongPressMenu(document);
}
