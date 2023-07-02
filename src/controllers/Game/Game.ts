const monstersList = require("../../lists/monstersList").data;
const npcsList = require("../../lists/npcsList").data;
const Player = require("../../components/Creatures/Player")
const Monster = require("../../components/Creatures/Monster")
const NPC = require("../../components/Creatures/NPC")
const game = require("../../../public/js/gameDetails");

import WebSocket from '../WebSocket/WebSocket'

// require('../../config/jsExtensions')

module.exports = class Game {

	private requestsQueue: any = {};
	private summary:  {
		players: Array<typeof Player>,
		monsters: Array<typeof Player>,
		items: Array<typeof Monster>,
		npcs: Array<typeof NPC>,
		walls: Array<any>,
	};
	private wsServer: any;
	private server: any;
	private creaturesToUpdateQueue: Array<any> = [];
	private uid: number = 0; 

	constructor(server: any) {
		this.server = server
		this.summary = {
			players: [],
			monsters: [],
			npcs: [],
			items: [],
			walls: [],
		}
		this.init()
	}

	private async init(){
		this.wsServer = await WebSocket( this.server )
		this.initMonsters()
		this.initNPCs()
		this.mainLoop()
	}

	private mainLoop(){

		setTimeout(() => { this.mainLoop() }, 100)
		
		this.requestsQueue = {}
		this.getIterationRequestsQueue()
		
		this.creaturesToUpdateQueue = []
		this.getIterationCreaturesUpdateQueue()

		this.updateCreatures()

		this.sendUpdatesToClients()

		this.wsServer.clientsRequestsQueue = []

	}

	private sendUpdatesToClients(){
		// console.log({to_update: this.creaturesToUpdateQueue })
		// console.log('to_update:', this.creaturesToUpdateQueue.map(c => c.name) )
		for(const creature of this.creaturesToUpdateQueue){
			if(creature.type === 'player'){
				this.wsServer.sendDataToClient({
					name: creature.name,
					key: creature.key
				},{
					game,
					items: [],
					walls: [],
					creatures: this.creaturesToUpdateQueue,
				})
			}
		}
	}

	private initNPCs(){
		
		this.summary.npcs = npcsList.map(( npc: any ) => {
			return new NPC(npc.name, ++this.uid, npc.position)
		})

	}

	private initMonsters(){

		this.summary.monsters = monstersList.map(( monster: any ) => {
			return new Monster(monster.name, ++this.uid, monster.position)
		})

	}

	private updateCreatures(){

		for(const creature of this.creaturesToUpdateQueue){
			const request = this.requestsQueue[creature.name] || {}

			if(request.logout){
				this.summary.players = this.summary.players.filter( player => {
					return player.name !== creature.name;
				})
				this.creaturesToUpdateQueue = this.creaturesToUpdateQueue.filter( player => {
					return player.name !== creature.name;
				})
				continue
			}

			creature.update(request, this.creaturesToUpdateQueue, [], [])
			
		}
	}

	private getIterationRequestsQueue(): void{
		for(const request of this.wsServer.clientsRequestsQueue){
			const player = this.getPlayer(request)
			if(!this.requestsQueue[player.name]){
				this.requestsQueue[player.name] = request
			}
		}
	}

	private getIterationCreaturesUpdateQueue(): void{

		for(const player of this.summary.players){
			let areNearestUpdated = false
			const nearbyCreatures = [...this.summary.monsters, ...this.summary.npcs, ...this.summary.players]
			.filter( cr => {

				if(cr.type == 'player' && cr.name === player.name){
					return this.requestsQueue[player.name] ? true : false
				}

				if(cr.type == 'player' && !this.requestsQueue[cr.name] && !this.requestsQueue[player.name]){
					return false
				}

				if(!cr.position || !player.position){
					return false
				}
				
				return Math.abs(cr.position[0] - player.position[0]) < Math.ceil( game.mapSize[0] / 2 ) + 1
					&& Math.abs(cr.position[1] - player.position[1]) < Math.ceil( game.mapSize[1] / 2 ) + 1
			})
			.forEach( pushingCreature => {
				
				if(Object.keys(pushingCreature.serverUpdating).length){
					areNearestUpdated = true
				}

				if(!this.creaturesToUpdateQueue.filter(cr => pushingCreature.id == cr.id).length){
					this.creaturesToUpdateQueue.push(pushingCreature)
				}

			})

			if(areNearestUpdated && !this.creaturesToUpdateQueue.filter(cr => player.id == cr.id).length){
				this.creaturesToUpdateQueue.push(player)
			}

		}

	}

	private getPlayer(request: any){
		
		for(const player of this.summary.players){
			if(player.name === request.name){
				return player
			}
		}

		const player = new Player(request.name, ++this.uid)
		this.summary.players.push(player)
		return player

	}

}

