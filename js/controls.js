const controls = {
  init(){
    this.vals = [];
  },
  update(params){
    if(params[1] == true && this.vals.indexOf(params[0]) == -1){
      this.vals.push(params[0]);
    }else if(params[1] == false){
      this.vals.splice(this.vals.indexOf(params[0]),1);
    }
  }
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
      let leftPanel = document.querySelector(".leftPanel");
      leftPanel.innerHTML = "<div class='arrow'>TARGET</div>";
  },
  preventZoom: () => {
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
        // special hack to prevent zoom-to-tabs gesture in safari
        document.body.style.zoom = 0.99;
    });
    
    document.addEventListener('gesturechange', function(e) {
        e.preventDefault();
        // special hack to prevent zoom-to-tabs gesture in safari
        document.body.style.zoom = 0.99;
    });
    
    document.addEventListener('gestureend', function(e) {
        e.preventDefault();
        // special hack to prevent zoom-to-tabs gesture in safari
        document.body.style.zoom = 0.99;
    });
  }
}
