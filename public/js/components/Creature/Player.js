class Player extends Creature {

  constructor(position, name, id){
    // super('player', position, name, id)
    super( 'player', position, name, id )

    if(name === player.name){
      this.main = true
      this.x = Math.floor( game.mapSize[0]/2 ) * game.square;
      this.y = Math.floor( game.mapSize[1]/2 ) * game.square;
    }

    // constructor(type,[x, y, z], pName,id){
  }

}