let inGameConsole;
const gamePlane = {
  fps : game.fps,
  actions: [],
  items:[],
  creatures : {
    list: [],
    ids: []
  },
  // sprites: [],
  canvas : document.querySelector(".gamePlaneCanvas"),
  init () {
    this.canvas.width = 440;
    this.canvas.height = this.canvas.width;
    this.gridSize = this.canvas.width/11;
    this.context = this.canvas.getContext("2d");

    inGameConsole = new Text();
    this.interval = setInterval(this.updategamePlane, 1000/gamePlane.fps);
    controls.init();
    controls.planeClicking.init(this.canvas.width,this.canvas.width,40);
    this.canvas.addEventListener(mobileControls.ev, (e) => {controls.planeClicking.get(e)});
  },
  updategamePlane() {
    serv.load(()=>{
      menus.update();
      gamePlane.context.clearRect(0, 0, gamePlane.canvas.width, gamePlane.canvas.height);
      if(player.update.constructor === Function){
        player.update();
      }else{
        console.error(player.update());
      }
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
      // update items
      for(const i of gamePlane.items){i.update();drawStack.push(i);}
      // sort it in order of rendering.
      drawStack.sort((a,b)=>{
        // player above items
        // if(b.type == "player" && a.type == "item"){return -1;}
        let keyA = "position"; 
        let keyB = "position"; 
        const staticElements = ['doors','walls','floors','halffloors','item','stairs'];
        const movingElements = ['monster','player','npc'];
        if(a.position[2]*1 > b.position[2]*1){
          return 1;        
        }else if(a.position[2]*1 < b.position[2]*1){
          return -1;
        }else if(movingElements.includes(b.type) && movingElements.includes(a.type)){
            keA = "newPos";
            keB = "newPos";
          
        }else if(movingElements.includes(b.type) && !movingElements.includes(a.type)){
            keA = "position";
            keB = "newPos";
          
        }else if(!movingElements.includes(b.type) && movingElements.includes(a.type)){
            keA = "newPos";
            keB = "position";
        }
        // dead body down.
        if( typeof a.health != "undefined" && a.health <= 0 ||  typeof b.health != "undefined" && b.health <= 0 ){
          if((a.health <= 0 && b.health > 0) || (b.health <= 0 && a.health > 0)){
            return -1;
          }
          return 1;
        }
        // items down
        if(staticElements.includes(a.type) && movingElements.includes(b.type)){
          return -1;
        }
        if(staticElements.includes(b.type) && movingElements.includes(a.type)){
          return 1;
        }
        if(a[keyA][1] >= b[keyB][1]){return 1;}
        if(a[keyA][0] <= b[keyB][0]){return 1;}
      })
      // draw all in order
      for(const e of drawStack){
        e.draw();
      }
      // update actions
      // console.log(gamePlane.actions.length);
      for(const a of gamePlane.actions){a.update();}
      inGameConsole.update();
    });
  },
  stop(title = "GAME PAUSED."){
    // show popup
    popup.init(title);
    clearInterval(this.interval);
    menus.console.log(
      "Game Paused. <a href='/game.html'>RELOAD</a> to play.",
      {color:"#fff"}
    )
  }
}