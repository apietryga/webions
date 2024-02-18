class Game {

  // data = null
  gamePlane = null
  creatures = null
  updatingKeys = [
    'serverUpdating',
    'name',
    'id',
    'sprite',
    'colors',
    // 'type',
    // 'position',
    'direction',
    // "walk",
    // "speed",
    // "totalSpeed",
    // "direction",
    "health",
    // "maxHealth",
    "totalHealth",
    // "visibleFloor"
    
    // "redTarget",
    // "restore",
    // "sprite",
    // "exhaustTime",
    // "exhaust",
    // "baseSpeed",
    // "skills",
    // "speaker",
    // "dial"
  ]

  setData(data, gamePlane){

    data = JSON.parse(data)
    this.creatures = this.setCreatures(data)
    this.gamePlane = gamePlane

    this.createCreatures()
    this.updateCreatures()

  }

  setCreatures(data){

    const creatures = new Map()
    console.log({data})
    data.creatures.forEach(creature => {
      creatures.set(creature.id, creature)
    })

    return creatures
    
  }

  createCreatures(){

    const isset_creatures_ids = this.gamePlane.creatures.list.map(creature => creature.id)

    this.creatures.forEach(creature => {
      if(isset_creatures_ids.includes(creature.id)) return
      const new_creature = this.createCreature(creature)
      this.gamePlane.creatures.list.push(new_creature)
    })

  }

  createCreature(newCreature){

    let creature = null
    const { type, position, name, id } = newCreature

    if(type === 'player'){
      creature = new Player(position, name, id)
    }

    if(type === 'monster'){
      creature = new Monster(position, name, id)
    }

    if(type === 'npc'){
      creature = new Npc(position, name, id)
    }

    return creature

  }

  updateCreatures(){

    this.gamePlane.creatures.list.forEach(creature => {

      for(const property of this.updatingKeys){
        creature[property] = this.creatures.get(creature.id)?.[property]
      }

      if(creature.name === player.name){
        player = creature
      }

    })

  }

}