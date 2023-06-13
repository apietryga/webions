const inGameMonsters = require("../../lists/monstersList").data;
const Player = require("../../components/Creatures/Player")
const Monster = require("../../components/Creatures/Monster")
const monstersTypes = require("../../types/monstersTypes");
// const npcs = require("../../lists/npcs").npcs;
const game = require("../../../public/js/gameDetails");
const WebSocket = require('../WebSocket/WebSocket')
// const { Summary } = require("./interfaces")
import { Summary } from './GameInterfaces'

require('../../config/jsExtensions')


module.exports = class Game {

	private requestsQueue: any = [];
	private summary: Summary;
	private wsServer: any;
	private server: any;
	private creaturesToUpdateQueue: Array<any> = [];
	private clientsRequestsQueue: Array<any> = [];

	constructor(server: any) {
		this.server = server
		// new WebSocketServer({httpServer : server})
		// .on('request', (req: { accept: (arg0: string, arg1: any) => any; origin: any; }) => {
		// 	// clientsRequestsQueue.push()
		// })
		// this.wsServer = WebSocket( server )
		// this.server = server
		// this.wsServer = WebSocket( server , cm, im)
		// const wsServer = wsController( server , cm, im, global.dbconnected)
		// this.wsServer = wsServer
		this.summary = {
			players: [],
			monsters: [],
			items: [],
			walls: [],
		}
		// this.creaturesToUpdateQueue = []
		// this.requestsQueue = {}

		// this.loadAllMonsters()
		
		// ( async () => {
		// 	await this.run()
		// 	this.mainLoop()
		// })()
		// this.wsServer.on()
		this.init()
	}

	async init(){
		this.wsServer = await WebSocket( this.server )
		// return this.wsServer = await WebSocket( this.server )
		this.mainLoop()
	}

	mainLoop(){
		setTimeout(() => { this.mainLoop() }, 50)
		// console.log('sss', this.wsServer)
		if(!this.wsServer.clientsRequestsQueue){ return }
		this.creaturesToUpdateQueue = []
		this.resolveRequestsQueue()
	}

	async resolveRequestsQueue() {

		this.prepareQueues()
		
		for(const player of this.summary.players){
			this.creaturesToUpdateQueue.push(...this.getNearbyCreaturesToUpdate(player))
		}

		this.updateCreatures()

		// console.log('looping')

		for(const player of this.summary.players){
			// 
			if(Object.keys(player.serverUpdating).length){
				console.log('servUpdating', player.serverUpdating, Object.keys(player.serverUpdating).length)
				this.wsServer.sendDataToClient({
					game,
					items: [],
					walls: [],
					creatures: this.creaturesToUpdateQueue,
				})
			}
		}


		this.wsServer.clientsRequestsQueue = []


	}

	updateCreatures(){
		// console.log(...this.creaturesToUpdateQueue.map(c => c.serverUpdating) )
		const playersWithRequests = Object.keys(this.requestsQueue)
		for(const creature of this.creaturesToUpdateQueue){
			if(!playersWithRequests.includes(creature.name)){
				// creature.update({}, global.dbconnected , this.creaturesToUpdateQueue, [], [])
				creature.update({}, this.creaturesToUpdateQueue, [], [])
				continue
			}
			for(const request of this.requestsQueue[creature.name]){
				// creature.update(request, global.dbconnected, this.creaturesToUpdateQueue, [], [])
				creature.update(request, this.creaturesToUpdateQueue, [], [])
			}
		}
		this.requestsQueue = {}
	}

	prepareQueues(){
		for(const request of this.wsServer.clientsRequestsQueue){
			const player = this.getPlayerFromList(request)
			if(!this.requestsQueue[player.name]){
				this.requestsQueue[player.name] = []
			}
			this.requestsQueue[player.name].push(request)
		}
	}

	private getNearbyCreaturesToUpdate(player: any){
		// console.log(...this.creaturesToUpdateQueue.map(c => c.serverUpdating) )

		const nearbyCreatures = [...this.summary.monsters, ...this.summary.players].filter( cr => {
			// console.log(cr.serverUpdating)
			return Math.abs(cr.position[0] - player.position[0]) < Math.ceil( game.mapSize[0] / 2 ) + 1
				&& Math.abs(cr.position[1] - player.position[1]) < Math.ceil( game.mapSize[1] / 2 ) + 1
				// && (cr.serverUpdating && !cr.serverUpdating.isEmpty())
				&& this.creaturesToUpdateQueue.map( i => {
					if( i.id ){ return i.id != cr.id }
					return i.name != cr.name
				})
		})
		
		// this.creaturesToUpdateQueue.push(...nearbyCreatures)
		return nearbyCreatures

	}

	private getPlayerFromList(request: any){
		let player = this.summary.players.find(i => i.name = request.name)
		if(!player){
			const id = this.summary.players.length + this.summary.monsters.length + 1
			player = new Player(request.name, id)
			console.log("NEW")
			this.summary.players.push(player)
		}
		return player
	}

	private loadAllMonsters(): void {
    // for(const m of inGameMonsters){
		// 	const monster = new Monster(m.name, this.summary.monsters.length, m.type || "monster")

    //   for(const k of Object.keys(m)){
    //     monster[k] = m[k];
    //   }

		// 	monster.startPosition = m.position;
      
    //   // for(const sm of monstersTypes.concat(npcs)){ // single monster
    //   for(const sm of monstersTypes){ // single monster
    //     if(sm.name == m.name){
    //       for(const md of Object.keys(sm)){ // monster details
    //         monster[md] = sm[md];
    //       }
    //     }
    //   }
    //   // monster.maxHealth = monster.health;
    //   this.summary.monsters.push(monster);
    // }
	}

}

