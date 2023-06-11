const inGameMonsters = require("../lists/monstersList").data;
const Player = require("../components/Creatures/Player")
const Monster = require("../components/Creatures/Monster")
const monstersTypes = require("../types/monstersTypes");
const npcs = require("../lists/npcs").npcs;
const game = require("../../public/js/gameDetails");

module.exports = class Game {

	constructor(wsServer) {
		this.wsServer = wsServer
		this.summary = {
			players: [],
			monsters: [],
			items: [],
			walls: [],
		}

		this.creaturesToUpdateQueue = []

		this.loadAllMonsters()
		this.mainLoop()
	}

	mainLoop(){
		setTimeout(() => { this.mainLoop() }, 1000)
		if(!this.wsServer.requestsQueue){ return }

		this.creaturesToUpdateQueue = []
		this.resolveRequestsQueue()



	}

	async resolveRequestsQueue() {
		// console.log("RQ: ", this.wsServer)
		
		let request;
		// for(const request of this.wsServer.requestsQueue){
		for(request of this.wsServer.requestsQueue){
			const player = this.getPlayerFromList(request)
			this.getNearbyCreaturesToUpdate(player)
		}

		for(const creature of this.creaturesToUpdateQueue){
			creature.update(request, dbconnected, this.creaturesToUpdateQueue, [], [])

			if(creature.type == 'player'){
				this.wsServer.sendDataToClient({
					items: [],
					walls: [],
					creatures: [...this.summary.players, ...this.summary.monsters]
				})
			}

			console.log({ creature })

		}


		this.wsServer.requestsQueue = []
		// console.log()v


	}

	getNearbyCreaturesToUpdate(player){
		
		const nearbyCreatures = [...this.summary.monsters, ...this.summary.players].filter( cr => {
			return Math.abs(cr.position[0] - player.position[0]) < Math.ceil( game.mapSize[0] / 2 ) + 1
				&& Math.abs(cr.position[1] - player.position[1]) < Math.ceil( game.mapSize[1] / 2 ) + 1
				// && player.name != cr.name
				&& this.creaturesToUpdateQueue.map( i => {
					if( i.id ){ return i.id != cr.id }
					return i.name != cr.name
				})
		})
		
		this.creaturesToUpdateQueue.push(...nearbyCreatures)

	}

	getPlayerFromList(request){
		let player = this.summary.players.find(i => i.name = request.name)
		if(!player){
			const id = this.summary.players.length + this.summary.monsters.length + 1
			player = new Player(request.name, id)
			this.summary.players.push(player)
		}
		return player
	}

	loadAllMonsters(){
    for(const m of inGameMonsters){
			const monster = new Monster(m.name, this.summary.monsters.length, m.type || "monster")

      for(const k of Object.keys(m)){
        monster[k] = m[k];
      }

			monster.startPosition = m.position;
      
      for(const sm of monstersTypes.concat(npcs)){ // single monster
        if(sm.name == m.name){
          for(const md of Object.keys(sm)){ // monster details
            monster[md] = sm[md];
          }
        }
      }
      // monster.maxHealth = monster.health;
      this.summary.monsters.push(monster);
    }
	}

}
