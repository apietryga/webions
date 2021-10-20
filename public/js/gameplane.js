let inGameConsole;
const gamePlane = {
  fps : game.fps,
  actions: [],
  creatures : {
    list: [],
    ids: []
  },
  sprites: [],
  canvas : document.querySelector(".gamePlane > canvas"),
  init () {
    this.canvas.width = 440;
    this.canvas.height = this.canvas.width;
    controls.planeClicking.init(this.canvas.width,this.canvas.width,40);
    
    this.gridSize = this.canvas.width/11;
    this.context = this.canvas.getContext("2d");
    inGameConsole = new Text();
    this.interval = setInterval(this.updategamePlane, 1000/gamePlane.fps);
    controls.init();
    // this.canvas.onclick = (e) => {controls.planeClicking.get(e)};
    this.canvas.addEventListener(mobileControls.ev, (e) => {controls.planeClicking.get(e)});
   
  },
  updategamePlane() {
    gamePlane.context.clearRect(0, 0, gamePlane.canvas.width, gamePlane.canvas.height);
    serv.load();
    if(player.type == "player"){ // on serv load player
      document.querySelector(".loader").style.display = "none";
      player.update();
      map.update([player.newPos[0],player.newPos[1],map.visibleFloor]);
      const drawStack = [];
      // update grids
      for(const g of map.grids){
        g.update();
        drawStack.push(g);
      }
      // update creatures
      for(const c of gamePlane.creatures.list){
        if(c.id != player.id){c.update();}
        drawStack.push(c);
      }
      // sort it in order of rendering.
      drawStack.sort((a,b)=>{
        if(a.position[2] < b.position[2]){
          return -1;
        }else if(a.position[2] == b.position[2]){
          // doors always up
          if(b.type == "doors"){return -1;}
          // floors always down.
          if(a.type == "floors"){return -1;}
          // dead body down.
          if(typeof a.health != "undefined" && a.health <= 0 
          && typeof b.health != "undefined"){return -1;}
          // right and bottom down.
          if(a.type != "floors" && b.type != "floors"){
            if(a.position[1] < b.position[1]){return -1;}
            if(a.position[0] < b.position[0]){return 1;}
          }
        }

        // stairs and walls 

      })
      // console.log(drawStack);
      // draw all in order
      for(const e of drawStack){
        e.draw();
      }
      for(const a of gamePlane.actions){a.update();}
      inGameConsole.update();
    }
  },
  stop(title = "GAME STOPPED."){
    // show popup
    popup.init(title);
    clearInterval(this.interval);
    console.log("Game stopped.")
  }
}