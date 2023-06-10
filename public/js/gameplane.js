let fistIteration = true;
let inGameConsole;

// const gamePlane = {
class GamePlane {

	constructor(){
		this.fps = game.fps
		this.actions = []
		this.items = []
		this.creatures = {
			list: [],
			ids: []
		}
		this.canvas = document.querySelector(".gamePlaneCanvas")
    this.context = this.canvas.getContext("2d");
	}

  init () {
  // start () {
    this.canvas.width = game.square * game.mapSize[0];
    this.canvas.height = game.square * game.mapSize[1];
    // this.gridSize = this.canvas.width/11;
    this.gridSize = this.canvas.width/game.mapSize[0];
    // this.context = this.canvas.getContext("2d");
    inGameConsole = new Text();
    this.interval = setInterval(this.updategamePlane, 1000/gamePlane.fps);
    controls.init();
    // controls.planeClicking.init(this.canvas.width,this.canvas.width,40);
    controls.planeClicking.init(this.canvas.width,this.canvas.width, game.square);
    this.canvas.addEventListener(mobileControls.ev, (e) => {controls.planeClicking.get(e)});

    this.socketWorker = new Worker('/js/workers/socketWorker.js');
    this.socketWorker.postMessage('init');
    this.socketWorker.onmessage = data => { this.getServInfo( data ) }
  }
  
	getServInfo( data ){
    console.log("GETTED SERV INFO", { data })


  }

	clearPlane(){
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}

  updategamePlane = async () => {
		// console.log('this',  this )
    await serv.load()
      // console.log('serv loaded')
		this.clearPlane()
      // gamePlane.context.clearRect(0, 0, gamePlane.canvas.width, gamePlane.canvas.height);
      if(isSet(player.update) && player.update.constructor === Function){
        player.update();
      }
      menus.update();
      if(!isSet(player.newPos)){player.newPos = player.position;}
      map.update([player.newPos[0],player.newPos[1],map.visibleFloor]);
      const drawStack = [];
      const nicksStack = [];
      // filter mwalls zIndex
      const filteredMWalls = [];
      if(!gamePlane.mwalls){return }
      for(const wall of gamePlane.mwalls){
        if(wall.position[2] <= map.visibleFloor ){
          filteredMWalls.push(wall);
        }
      }
      const allElements = map.grids
        .concat(gamePlane.creatures.list)
        .concat(gamePlane.items)
        .concat(filteredMWalls);
      for(const el of allElements){
        el.update();
        drawStack.push(el);
        if(el.constructor === Creature){
          nicksStack.push(el.nick);
        }
      }
      const upperEls = ['upperwalls','doors','walls','mwalls'];
      drawStack.sort((a,b)=>{
        a.pos = [a.position[0]*1,a.position[1]*1,a.position[2]*1];
        b.pos = [b.position[0]*1,b.position[1]*1,b.position[2]*1];
        if(a.pos[2] < b.pos[2]){ return -1 }
        else if(a.pos[2] > b.pos[2]) { return 1 }
        else{
          // nofloors down
          if(['nofloors'].includes(a.type)){return -1;}if(['nofloors'].includes(b.type)){return 1;}
          // floors down
          if(['floors'].includes(a.type)){return -1;}if(['floors'].includes(b.type)){return 1;}
          // halffloors after down
          if(['halffloors'].includes(a.type)){return -1;}if(['halffloors'].includes(b.type)){return 1;}
          // the same position
          if(a.pos[0] == b.pos[0] && a.pos[1] == b.pos[1]){
            // mwalls above items
            if(['mwalls'].includes(a.type)){return 1;}if(['mwalls'].includes(b.type)){return -1;}
            
            // items above walls
            if(['item'].includes(a.type) && upperEls.includes(b.type)){return 1;}
            if(['item'].includes(b.type) && upperEls.includes(a.type)){return -1;}
            // upperwalls top
            if(upperEls.includes(a.type)){return 1;}if(upperEls.includes(b.type)){return -1;}
            // items down
            if(['item'].includes(a.type)){return -1;}if(['item'].includes(b.type)){return 1;}
            // dead body down
            if(a.constructor === Creature && b.constructor == Creature){
              if(a.health < 1){return -1;}
              if(b.health < 1){return 1;}
            }
          }
          if(a.pos[0] > b.pos[0]){return  1}
          if(a.pos[0] < b.pos[0]){return -1}
          if(a.pos[1] > b.pos[1]){return  1}
          if(a.pos[1] < b.pos[1]){return -1}
          return -1
        }
      })
      // draw all in order
      for(const e of drawStack.concat(nicksStack)){ e.draw(); }
      // update actions
      for(const a of gamePlane.actions){a.update();}
      inGameConsole.update();
      // call only ones
      if(fistIteration){
        document.querySelector(".loader").style.display = "none";
        // automation buttons update
        if(isSet(player.autoShot) && player.autoShot){
          // console.log("CLICKED")
          const shooterDOM = document.querySelector('.shooterDOM');
          menus.mainMenu.automation(shooterDOM);
        }
        // autoMWDrop 
        if(isSet(player.autoMWDrop) && player.autoMWDrop){
          const wallerDOM = document.querySelector('.wallerDOM');
          menus.mainMenu.automation(wallerDOM);
        }
      }
      // update button on/off (from serv info)
      menus.mainMenu.automation(document.querySelector('.wallerDOM'),player.autoMWDrop);

      fistIteration = false;
  }

  stop(title = "GAME PAUSED."){
    // show popup
    popup.init(title);
    clearInterval(this.interval);
    menus.console.log(
      // "Game Paused. <a href='/game.html'>RELOAD</a> to play.",
      "Game Paused. <a href='/game'>RELOAD</a> to play.",
      {color:"#fff"}
    )
  }

}