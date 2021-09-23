const controls = {
  currentTarget : false,
  init(){
    this.vals = [];
  },
  update(params){
    // white target on client side (84 is t key)
    const targetKeys = [83,84];
    for(const pk of params){
      if(targetKeys.includes(pk)){  
        this.targeting(params);
      } 
    }
    // prepare table to send
    if(params[1] == true && !this.vals.includes(params[0])){
      this.vals.push(params[0]);
    }else{
      this.vals.splice(this.vals.indexOf(params[0]),1);
    }
    if(params[0] == 68 && params[1] && (!player.redTarget || (serv.time < player.shotExhoust))){
      gamePlane.actions.push(new Action("misc",player.x,player.y,40,40,0));
    }
    if(params[0] == 72 && params[1] && (player.health == player.maxHealth || (serv.time < player.healthExhoust))){
      gamePlane.actions.push(new Action("misc",player.x,player.y,40,40,0));  
    }    
  },
  targeting(param){
    //  TARGET LIST
    const cToTarget = [];
    // cToTarget update
    for(const c of gamePlane.creatures.list){
      if(   c.name != player.name 
         && c.health > 0
         && c.position[2] == player.position[2]  
         && Math.abs(c.position[0] - player.position[0]) < 6  
         && Math.abs(c.position[1] - player.position[1]) < 6  
       ){
        cToTarget.push(c);
      }
    }
    // white targeting ( T key )
    if(param[0] == 84 && param[1] == true){
      // get target index of list
      this.currentTarget++;
      if(this.currentTarget > cToTarget.length){
        this.currentTarget = false;
      }
      for(let i = 0; i < cToTarget.length; i++){  
        if(i == this.currentTarget-1){
          player.whiteTarget = cToTarget[i].id;
          break;
        }else{
          player.whiteTarget = false;
        }
      }

    }
    // red targeting (white target + S key)
    if(param[0] == 83 && param[1] == true &&(isSet(player.whiteTarget) && player.whiteTarget)){
      if(this.currentTarget && typeof player.redTarget != "undefined"){
        if(player.redTarget == cToTarget[this.currentTarget-1].id){
          player.redTarget = "clear";
        }else{
          player.redTarget = cToTarget[this.currentTarget-1].id;
        }
      }else{
        player.redTarget = "clear";
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
      // GET X Y pos.
      const x = Math.floor(e.offsetX/this.g)+player.newPos[0]-5;
      const y = Math.floor(e.offsetY/this.g)+player.newPos[1]-5;
      // TARGET CLICKING
      let isCreature = false;
      for(const c of gamePlane.creatures.list){
        if(c.newPos[0] == x && c.newPos[1] == y & c.newPos[2] == player.newPos[2]){
          isCreature = true;
          // player.whiteTarget = c.id;
          player.redTarget = c.id;
        }
      }
      // WALKING CLICKING
      if(!isCreature){
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
          this.route = setRoute(player.newPos,[x,y,player.newPos[2]],map,gamePlane.creatures.list,5000);
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
          // console.log(this.route);
          
  
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
  validate : () => {
    let panel = document.querySelectorAll(".mobileControls");
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      console.log("Detect mobile device, setting controls.");
      panel[0].style.display = "flex";
      panel[1].style.display = "flex";
      mobileControls.set();
    }else{
      panel[0].style.display = "none";
      panel[1].style.display = "none";
    }
  },
  set: () => {
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
    // mobileControls.rightButtons = new buttons("right");
    // mobileControls.rightButtons.build();

    mobileControls.build("rightPanel");

    // mobileControls.leftButtons = new buttons("left");
    // mobileControls.leftButtons.build();
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
          [" ",0]
        ];
        // console.log(buttons);
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
  preventZoom: () => {
    // window.oncontextmenu = function() { return false; }
    // function preventLongPressMenu(nodes) {
    //   for(var i=0; i<nodes.length; i++){
    //     // nodes[i].ontouchstart = absorbEvent_;        
    //     // nodes[i].ontouchmove = absorbEvent_;
    //     // nodes[i].ontouchend = absorbEvent_;
    //     // nodes[i].ontouchcancel = absorbEvent_;

    //     nodes[i].addEventListener("touchstart",absorbEvent_);
    //     nodes[i].addEventListener("touchmove",absorbEvent_);
    //     nodes[i].addEventListener("touchend",absorbEvent_);
    //     nodes[i].addEventListener("touchcancel",absorbEvent_);
    //   }
    // }
    // preventLongPressMenu(document.querySelectorAll('*:not(button,.mobileControls)'));
  
  }
}