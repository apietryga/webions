let map = {
  position:[1,1,1],
  grids: [],
  load(callback){
    console.log("map loading.")
    fetch("../json/map.json")
    .then(dt => dt.json())
    .then(data => {
      map.template = data;
      callback();
    })
  },
  generate(callback){
    this.load(()=>{
      for(t of this.template){
        this.grids.push(new Grid(t));     
      }
      callback();  
    });
  },
  update(){
    for(g of this.grids){
      g.update();
    }
  },
  draw(zIndex){
    this.hideFloor = [];
    // get info loop
    for(g of this.grids){
      // render only nearest objects
      if(Math.abs(g.position[0] - player.position[0]) < 7
      && Math.abs(g.position[1] - player.position[1]) < 7){
        // set zIndex when player is for smth (za czyms)
        if(g.type == "stairs"){
          if(
            (Math.ceil(player.position[0])+1 == g.position[0] && Math.ceil(player.position[1]) == g.position[1])
            ||(Math.ceil(player.position[1])+1 == g.position[1] && Math.ceil(player.position[0]) == g.position[0])
            ||(Math.ceil(player.position[1])+1 == g.position[1] && Math.ceil(player.position[0])+1 == g.position[0])
          ){
            g.zIndex = g.position[2]+1;
            g.lastZIndex = g.zIndex;
  //          g.draw(g.zIndex);
          }else{
            g.zIndex = g.position[2];
          }
          if(g.lastZIndex != g.zIndex){
            g.lastZIndex = g.zIndex;
            g.draw(g.zIndex);   
          }
        }
        // hide floor when player is below smth
        if(Math.floor(player.position[0]) == g.position[0] && Math.floor(player.position[1]) == g.position[1] && Math.floor(player.position[2])+1 == g.position[2]){
          if(g.type != "stairs"){
            this.hideFloor.push(g.position[2]);
          }
        }
      }
    }
    // render elements loop
    for(g of this.grids){
      // render only nearest objects
      if(Math.abs(g.position[0] - player.position[0]) < 7
      && Math.abs(g.position[1] - player.position[1]) < 7){
        //first draw
        if(zIndex == -1 && g.zIndex < Math.floor(player.position[2])){
          g.draw(zIndex);
        }      
        // second draw
        if(zIndex == 0 && g.zIndex == Math.floor(player.position[2])){
          g.draw(zIndex);
        }
        // third draw
        if(zIndex == 1 && g.zIndex > Math.floor(player.position[2]) && !this.hideFloor.includes(g.zIndex)){
          g.draw(zIndex);
        }


      }
    }
  }
}