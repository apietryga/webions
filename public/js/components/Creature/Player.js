class Player extends Creature {

  constructor(position, name, id){
    // super('player', position, name, id)
    super( 'player', position, name, id )

    if(name === player.name){
      this.character = true
      this.x = Math.floor( game.mapSize[0]/2 ) * game.square;
      this.y = Math.floor( game.mapSize[1]/2 ) * game.square;
    }

    // constructor(type,[x, y, z], pName,id){
  }

  setVisibleFloor(){
    let isWindow = false;
    const z = player.position[2];
    const checkIfWindows = [
      [player.position[0],player.position[1]-1],
      [player.position[0],player.position[1]+1],
      [player.position[0]-1,player.position[1]],
      [player.position[0]+1,player.position[1]]
    ];
    for(const ch of checkIfWindows){
      for(const g of map.getGrid([ch[0],ch[1],z])){
        if(g[4] == "windows"){
          isWindow = true;
        }
      }  
    }
    // if player is under ground
    if(this.position[2] < 0){
      map.visibleFloor = z;
    // if is something above player [level up]
    }else if(map.getGrid([this.position[0].toFixed(),this.position[1].toFixed(),this.position[2]+1])[0]){
      map.visibleFloor = z;
    // if is something above player [2 level up]
    }else if(map.getGrid([this.position[0].toFixed(),this.position[1].toFixed(),this.position[2]+2])[0]){
      map.visibleFloor = z+1;
    // if player is near window
    }else if(isWindow){
      map.visibleFloor = z;
    }else{
      map.visibleFloor = map.maxFloor;
    }
    // }
  }
}