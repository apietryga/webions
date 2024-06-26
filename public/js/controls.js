const controls = {
  currentTarget : -1,
  vals: [],
  init(){
    this.writingNow = false;
    window.addEventListener('keydown', (e) => {controls.update([e.keyCode,true]);})
    window.addEventListener('keyup',  (e) => {controls.update([e.keyCode,false]);})
  },
  falseQuene:[],
  falseQueneCall(){
    for(const f of this.falseQuene){
      this.vals.splice(this.vals.indexOf(f),1);
      this.falseQuene.splice(this.falseQuene.indexOf(f),1);
    }
  },
  update(params){
    // console.log(params);
    // WRITING MESSAGE [13] is enter
    if(params[0] == 13 && !params[1] && this.vals.includes(13)){
      const input = document.querySelector(".messagesInput");
      const isFocused = (document.activeElement === input);
      if(isFocused){
        input.blur();
        this.writingNow = false;
        if(input.value != ""){
          // player.says = input.value;
          player.sayToServ = input.value;
        }
        input.value = "";
      }else{
        this.writingNow = true;
        input.focus();
      }
    }
    if(this.writingNow){return 0;}

    // MWALL
    // clear wall pointer
    if(params[0] != 87 || (params[0] == 87 && params[1]) ){
      document.body.style.cursor = "auto";
      player.mwall = false;
      // console.log("mwall release");
    }

    if(params[0] == 87 && params[1]){
      document.body.style.cursor = "cell";
      player.mwall = true;
    }

    // abort route when do something 
    this.planeClicking.route = [];
    // white target on client side (84 is t key)
    const targetKeys = [83,84];
    for(const pk of params){
      if(targetKeys.includes(pk)){  
        this.targeting(params);
      } 
    }
    // ACTIONS
    const actions = ['outfit'];
    if(actions.includes(params[0])){
      this.outfit =  params[1];
    }

  // CLICKING
    // click on
    if(params[1] == true && !this.vals.includes(params[0]*1)){
      this.vals.push(params[0]*1);
    }
    // release
    if(!params[1] && !this.falseQuene.includes(params[0]*1)){
      this.falseQuene.push(params[0]*1);
    }

  // KEYS ANIMATIONS:
    let action = false;
    // distance shot
    if(params[0] == 68 && params[1] && (!player.redTarget || (serv.time < player.exhoust))){
      action = new Action("misc",player.x,player.y,40,40,0);
    }
    // health
    if(params[0] == 72 && params[1] && (player.health == player.maxHealth || (serv.time < player.exhoust))){
      action = new Action("misc",player.x,player.y,40,40,0);
    }    
    if(action){
      let pushIt = true;
      for(const gpa of gamePlane.actions){
        if( gpa.type == action.type 
        &&  gpa.x == action.x 
        ){
          pushIt = false;
        }
      }
      if(pushIt){
        gamePlane.actions.push(action);
      }
    }
  },
  targeting(param){
    //  TARGET LIST
    const cToTarget = [];
    // Get all creatures can target
    for(const c of gamePlane.creatures.list){
      if(c.health > 0
         && c.position[2] == player.position[2]
         && Math.abs(c.position[0] - player.position[0]) < 6  
         && Math.abs(c.position[1] - player.position[1]) < 6 
         && ['monster','enemy'].includes(c.type) 
       ){
        cToTarget.push(c);
      }
    }
    // WHITE TARGETING ( T key )
    if(param[0] == 84 && param[1] == true){
      this.currentTarget = this.currentTarget >= cToTarget.length ? 0 : this.currentTarget += 1;
      player.whiteTarget = isSet(cToTarget[this.currentTarget]) ? cToTarget[this.currentTarget].id : false;
    }
    // RED TARGETING ( S key )
    if(param[0] == 83 && param[1] == true){
      if(isSet(player.whiteTarget) && player.whiteTarget){
        // red targeting (white target + S key)
        player.setRedTarget = player.whiteTarget == player.redTarget ? "clear" : player.whiteTarget;
      }else{
        // red targeting without whiteTargeting
        this.currentTarget = this.currentTarget >= cToTarget.length ? 0 : this.currentTarget += 1;
        player.setRedTarget = isSet(cToTarget[this.currentTarget]) ? cToTarget[this.currentTarget].id : "clear";
      } 
    }
  },
  planeClicking: {
    route : [],
    init(w,h,g){
      this.width = w;
      this.height = h;
      this.g = g;
    },
    get(e){
      let ox,oy;
      if(isSet(e.offsetX)){
        const gX = e.target.offsetWidth / game.mapSize[0];
        const gY = e.target.offsetHeight / game.mapSize[1];
        ox = Math.floor(e.offsetX/gX);
        oy = Math.floor(e.offsetY/gY);
      }
      // GET X Y pos.
      // const x = ox+player.newPos[0]-5;
      const x = ox + player.newPos[0] - Math.floor( game.mapSize[0] / 2 );
      // const y = oy+player.newPos[1]-5;
      const y = oy + player.newPos[1] - Math.floor( game.mapSize[1] / 2 );

      // MWALL CLICKING
      if(player.mwall){
        document.body.style.cursor = "auto";
        player.mwall = false;
        // console.log("set mwall on ["+x+", "+y+"]");
        player.mwallDrop = [x,y,player.position[2]];
        return 0;
      }

      // ITEM CLICKING
      let isAction = false;
      // drop item
      const picked = document.querySelector(".mainMenu .picked");
      if(picked != null){
        isAction = true;
        player.itemAction = {}
        player.itemAction.visibleFloor = map.visibleFloor;
        player.itemAction.position = [x,y,player.position[2]];
        player.itemAction.actionType = "drop";

        if(isSet(picked.field)){
          player.itemAction.field = picked.field;
        }else{

        }
      }else{
        // pick up item
        for(const item of gamePlane.items){
          // detect click on item
          if(compareTables(item.position,[x,y,player.position[2]])){
            // check if player stand next to item & if item is pickable
            if(Math.abs(item.position[0] - player.position[0]) < 2 && Math.abs(item.position[1] - player.position[1]) < 2 && item.pickable ){
              // console.log(item);
              // player.itemAction = item;
              player.itemAction = {};
              // console.log(item)
              player.itemAction.position = item.position;
              player.itemAction.actionType = "pickUp";
              isAction = true;
            }
          }
        }
      }

      // TARGET CLICKING
      let isCreature = false;
      for(const c of gamePlane.creatures.list){
        if(
           ['monster','enemy'].includes(c.type) 
          && ((c.newPos[0] == x && c.newPos[1] == y)
          || (c.oldPos[0] == x && c.oldPos[1] == y))
          && c.newPos[2] == player.newPos[2]
          ){
          isCreature = true;
          player.setRedTarget = c.id;
        }
      }
      // ACTION CLICKING
      for(const g of map.getGrid([x,y,player.newPos[2]])){
        if(g[5] == "startleauge"){
          isAction = true;
          console.log("STARTUJEMY LIGĘ!");
        }
      }
      // WALKING CLICKING
      if(!isCreature && !isAction){
        let isFloor = false;
        let isWall = false;
        for(const g of map.getGrid([x,y,player.newPos[2]])){
          if(map.avalibleGrids.includes(g[4])){
            isFloor = true;
          }
          if(map.notAvalibleGrids.includes(g[4])){
            isWall = true;
          }
        }
        // if click is focused on floor - try set route to it.
        if(!isWall && isFloor){
          // get mwalls
          let mwalls = [];
          for(const getWall of gamePlane.mwalls){
            mwalls.push( getWall.position);
          }
          this.route = setRoute(player.newPos,[x,y,player.newPos[2]],map,gamePlane.creatures.list,5000,mwalls);
          if(this.route.length > 0){
            this.route.push([x,y]);
          }
        }
      }
    },
    followRoute (){
      if(isSet(this.k)){
        controls.vals.splice(controls.vals.indexOf(this.k),1);
      }
      if(isSet(player.newPos) && this.route.length > 0){
        [oX,oY] = player.newPos;
        [nX,nY] = this.route[0];
        if( oX == nX && oY == nY ){
          this.route.shift();
        }
          
          // set key 
          if(oX > nX){this.k = 37;}
          if(oX < nX){this.k = 39;}
          if(oY > nY){this.k = 38;}
          if(oY < nY){this.k = 40;}
          // if(isSet(this.routeKey)){
            controls.vals.push(this.k);      
          // }
      }else{
        if(isSet(this.k)){
          delete this.k;
        }
      }
     
    }
  },
}
const mobileControls = {
  ev: 'click',
  css: document.querySelector("#mobileCSS"),
  validate(){
    let panel = document.querySelectorAll(".mobileControls");
    const consoleInput = document.querySelector(".messagesInput");
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      console.log("Detected mobile device, setting controls.");
      // mobilecontrols toggler
      document.querySelector(".toggleControls").style.display = "flex";
      panel[0].style.display = "flex";
      panel[1].style.display = "flex";
      this.set();
      this.preventZoom();
      this.ev = 'touchstart';
      this.css.disabled = false;
      consoleInput.placeholder = "Click here to type.";
    }else{
      // mobilecontrols toggler
      document.querySelector(".toggleControls").style.display = "none";
      this.css.disabled = true;
      panel[0].style.display = "none";
      panel[1].style.display = "none";
      if(consoleInput != null){
        consoleInput.placeholder = "Click enter to type.";
      }
    }
    // update css's callout
    const stylesheet = document.createElement('link');
    stylesheet.href = 'style/nocallout.css';
    stylesheet.rel = 'stylesheet';
    stylesheet.type = 'text/css';
    document.head.append(stylesheet);
  },
  set(){
    // resolution - window width & height
    let panelWidth; 
    let wW = document.body.offsetWidth;
    let wH = document.body.offsetHeight;
    let panels = document.getElementsByClassName("mobileControl");
    if(wW > wH){
      panelWidth = (wW - wH)/2+"px";
      document.body.style = `grid-template-areas: 'lb gp rb' ;`;
      for(p of panels){
        p.style.width = panelWidth;
        p.style.height = panelWidth;
      }
    }else{
      panelWidth = 50+"vw";
      document.body.style = `grid-template-areas: 'gp gp' 'lb rb' ;`;
      for(p of panels){
        p.style.width = panelWidth;
        p.style.height = panelWidth;
      }
    }
    this.build();
  },
  build(){
    // build panels
      // rightPanel
      const rightPanel = document.querySelector(".rightPanel");
      rightPanel.innerHTML = "";
      let arrows = ["↑", "←", "→", "↓"];
      let arrowsCodes = [38, 37, 39, 40];
      let arrow = 0;
      for(let i = 0; i < 9; i++){
        let singleField = document.createElement("div");
        if(i % 2 != 0){
          singleField.innerHTML = arrows[arrow];
          singleField.className = "arrow";
          singleField.dataset.keyCode = arrowsCodes[arrow];
          singleField.addEventListener("touchstart",(e) => {
            controls.update([e.target.dataset.keyCode,true]);
          })

          singleField.addEventListener("touchend",(e) => {
            controls.update([e.target.dataset.keyCode,false]);
          })
          arrow++;
        }
      rightPanel.appendChild(singleField);
      }
      // leftPanel
      const leftPanel = document.querySelector(".leftPanel");
      leftPanel.innerHTML = "";
      const buttons = [
        ["T",84],
        [" ",0],
        ["S",83],
        [" ",0],
        ["D",68],
        [" ",0],
        ["H",72],
        [" ",0],
        ["W",87]
      ];
      for(const b of buttons){
        const butt = document.createElement("div");
        if(b[0] != " "){
          butt.className = 'arrow';
        }

        butt.innerText = b[0];
        butt.dataset.keyCode = b[1];
        butt.addEventListener("touchstart",(e) => {
          controls.update([e.target.dataset.keyCode*1,true]);
        })
        butt.addEventListener("touchend",(e) => {
          controls.update([e.target.dataset.keyCode*1,false]);
        })
        leftPanel.append(butt);
      }
  },
  allowClick : ["BUTTON","CANVAS","arrow","gamePlaneCanvas"],
  preventZoom(){
    window.oncontextmenu = function() { return false; }
    for(const n of document.querySelectorAll('*')){
      if(!mobileControls.allowClick.includes(n.tagName || n.className)){
        n.addEventListener("touchstart",(e)=>{
          // if(this.iOS()){e.preventDefault();}
          // if(this.iOS()){e.returnValue = false;}
          e.stopPropagation && e.stopPropagation();
          e.cancelBubble = true;
        },{passive:false});
      }
    }   
  },
  iOS(){
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  }
}



// TESTED ON XBOX CONTROLLER
let joyPadInterval;
const joyPad = {
  state:false,
  gamePad:false,
  init(){
    this.state = true;
    console.log("JoyPad connected.");
    if(!joyPadInterval){
      joyPadInterval = setInterval(joyPad.update,150);
    }
  },
  update(){
    const clickedKeys = [];
    const upd = (key) => {controls.update([key,true]);clickedKeys.push(key)}
    const gamepads = navigator.getGamepads ? navigator.getGamepads():(navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    for(const gamepad of gamepads){if(gamepad){
      joyPad.gamePad = gamepad;
      // buttons
      for(const [id,button] of gamepad.buttons.entries()){
        if(button.pressed){
          // console.log(id);
          if(id == 12){upd(38);}  // top
          if(id == 13){upd(40);}  // bottom
          if(id == 14){upd(37);}  // left
          if(id == 15){upd(39);}  // right
          if(id == 4){upd(84);} // white target
          if(id == 5){upd(83);} // redtarget
          if(id == 1){upd(68);} // shot
          if(id == 0){upd(72);} // healing
          if(id == 7){
            const mainMenu = document.querySelector(".wrapper >.mainMenu");
            if(mainMenu.style.display == "none"){
              menus.mainMenu.show('mainMenu');
            }else{
              menus.mainMenu.close('mainMenu');
            }
          }
        }
      }

      // axes
      const [a1x, a1y, a2x, a2y] = gamepad.axes;
      if(Math.abs(a1x) > 0.5){
        if(a1x < 0){upd(37)}
        if(a1x > 0){upd(39)}
      }
      if(Math.abs(a1y) > 0.5){
        if(a1y < 0){upd(38)}
        if(a1y > 0){upd(40)}
      }

      // clear controls vals
      for(const ctrlVal of controls.vals){
        if(!clickedKeys.includes(ctrlVal)){
          controls.update([ctrlVal,false]);
        }
      }    
    }}
  },
  close(){
    console.log("JoyPad disconnected.");
    clearInterval(joyPadInterval);
    this.state = false;
  },
  vibrate(strength = 0.5, time = 50){
    if(this.state && this.gamePad){
      strength = Math.round(strength*10)/10;
      if(strength > 1){strength = 1;}
      this.gamePad.vibrationActuator.playEffect("dual-rumble", {
        duration: time,
        strongMagnitude: strength
      });
    }
  }
}
window.addEventListener("gamepaddisconnected", (ev) => {joyPad.close(ev);});
window.addEventListener("gamepadconnected", (ev) => {joyPad.init(ev);});
