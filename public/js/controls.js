const controls = {
  currentTarget : false,
  vals: [],
  init(){
    window.addEventListener('keydown', (e) => {controls.update([e.keyCode,true]);})
    window.addEventListener('keyup',  (e) => {controls.update([e.keyCode,false]);})
  },
  falseQuene:[],
  falseQueneCall(){
    // console.log(this.vals);
    for(const f of this.falseQuene){
      this.vals.splice(this.vals.indexOf(f),1);
      this.falseQuene.splice(this.falseQuene.indexOf(f),1);
    }
  },
  update(params){
    // abort route when do something 
    this.planeClicking.route = [];
    // white target on client side (84 is t key)
    const targetKeys = [83,84];
    for(const pk of params){
      if(targetKeys.includes(pk)){  
        this.targeting(params);
      } 
    }
  // CLICKING
    // click on
    if(params[1] && !this.vals.includes(params[0]*1)){
      // console.log(params);
      this.vals.push(params[0]*1);
    }
    // release
    if(!params[1] && !this.falseQuene.includes(params[0]*1)){
      this.falseQuene.push(params[0]*1);
    }

  // KEYS ANIMATIONS:
    let action = false;
    // distance shot
    if(params[0] == 68 && params[1] && (!player.redTarget || (serv.time < player.shotExhoust))){
      action = new Action("misc",player.x,player.y,40,40,0);
    }
    // health
    if(params[0] == 72 && params[1] && (player.health == player.maxHealth || (serv.time < player.healthExhoust))){
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
      console.log("e?")
      if(isSet(player)){
        let ox,oy;
        if(isSet(e.offsetX)){
          const g = e.target.clientWidth/11;
          ox = Math.floor((e.clientX - e.target.offsetLeft)/g);
          oy = Math.floor((e.clientY - e.target.offsetTop)/g);
        }else{
          // CHECKIT !!! 
          const g = e.touches[0].target.clientWidth/11;
          ox = Math.floor((e.touches[0].clientX - e.touches[0].target.offsetLeft)/g);
          oy = Math.floor((e.touches[0].clientY - e.touches[0].target.offsetTop)/g);
        }
        // GET X Y pos.
        const x = ox+player.newPos[0]-5;
        const y = oy+player.newPos[1]-5;
        // TARGET CLICKING
        let isCreature = false;
        for(const c of gamePlane.creatures.list){
          if(c.newPos[0] == x && c.newPos[1] == y & c.newPos[2] == player.newPos[2]){
            isCreature = true;
            player.redTarget = c.id;
          }
        }
        // ACTION CLICKING
        let isAction = false;
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
            this.route = setRoute(player.newPos,[x,y,player.newPos[2]],map,gamePlane.creatures.list,5000);
            if(this.route.length > 0){
              this.route.push([x,y]);
            }
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
  ev: 'click',
  validate(){
    let panel = document.querySelectorAll(".mobileControls");
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      console.log("Detect mobile device, setting controls.");
      panel[0].style.display = "flex";
      panel[1].style.display = "flex";
      this.set();
      this.preventZoom();
      this.ev = 'touchstart';
    }else{
      panel[0].style.display = "none";
      panel[1].style.display = "none";
    }
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
  allowClick : ["BUTTON","CANVAS","arrow","gamePlane"],
  preventZoom(){
    window.oncontextmenu = function() { return false; }
    for(const n of document.querySelectorAll('*')){
      if(!mobileControls.allowClick.includes(n.tagName || n.className)){
        // console.log(n.tagName+" | "+n.className);
        n.addEventListener("touchstart",(e)=>{
          if(this.iOS()){e.preventDefault();}
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