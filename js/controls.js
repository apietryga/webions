const controls = {
  currentTarget : false,
  init(){
    this.vals = [];
  },
  update(params){
    // console.log(params)
    // white target on client side (84 is t key)
    const targetKeys = [83,84];
    if(targetKeys.includes(params[0])){  
      this.targeting(params);
    }

    // prepare table to send
    if(params[1] == true && this.vals.indexOf(params[0]) == -1){
      this.vals.push(params[0]);
    }else if(params[1] == false){
      this.vals.splice(this.vals.indexOf(params[0]),1);
    }
    
  },
  targeting(param){
    //  TARGET LIST
    const cToTarget = [];
    let isTarget = false;
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
      // clear targets here
      for(const c of cToTarget){
          c.whiteTarget = false;  
      }
      if(this.currentTarget > cToTarget.length-1){
        this.currentTarget = false;
      }else{
        this.currentTarget++;
      }
      for(let i = 0; i < cToTarget.length; i++){
        const c = cToTarget[i];
        if(i == this.currentTarget-1){
          c.whiteTarget = true;
        }else{
          c.whiteTarget = false;  
        }
      }
    }
    // red targeting (white target + S key)
    if(param[0] == 83 && param[1] == true){
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
  build(ctrlID){
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
          ["TARGET",84],
          ["SELECT",83]
        ];
        for(const b of buttons){
          const butt = document.createElement("div");
          butt.className = 'arrow';
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
    window.oncontextmenu = function() { return false; }
    function preventLongPressMenu(nodes) {
      for(var i=0; i<nodes.length; i++){
         nodes[i].ontouchstart = absorbEvent_;
         nodes[i].ontouchmove = absorbEvent_;
         nodes[i].ontouchend = absorbEvent_;
         nodes[i].ontouchcancel = absorbEvent_;
      }
    }
    preventLongPressMenu(document.querySelectorAll('*'));
  //   var event = e || window.event;
  //  event.preventDefault();
  //  event.stopPropagation();
    // document.addEventListener('gesturestart', function(e) {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     // special hack to prevent zoom-to-tabs gesture in safari
    //     document.body.style.zoom = 0.99;
    // });
    
    // document.addEventListener('gesturechange', function(e) {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     // special hack to prevent zoom-to-tabs gesture in safari
    //     document.body.style.zoom = 0.99;
    // });
    
    // document.addEventListener('gestureend', function(e) {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     // special hack to prevent zoom-to-tabs gesture in safari
    //     document.body.style.zoom = 0.99;
    //     initPreventing();
    // });


    

  }
}
