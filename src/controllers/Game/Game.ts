const inGameMonsters = require("../../lists/monstersList").data;
const Player = require("../../components/Creatures/Player")
const Monster = require("../../components/Creatures/Monster")
const monstersTypes = require("../../types/monstersTypes");
// const npcs = require("../../lists/npcs").npcs;
const game = require("../../../public/js/gameDetails");
// const WebSocket = require('../WebSocket/WebSocket')

import WebSocket from '../WebSocket/WebSocket'

// require('../../config/jsExtensions')

module.exports = class Game {

	private requestsQueue: any = {};
	private summary:  {
		players: Array<any>,
		monsters: Array<any>,
		items: Array<any>,
		walls: Array<any>,
	};
	private wsServer: any;
	private server: any;
	private creaturesToUpdateQueue: Array<any> = [];

	// TODO INCREASE IT AFTER NPCS AND MONSTERS LOAD
	private uid: number = 0; 

	constructor(server: any) {
		this.server = server
		this.summary = {
			players: [],
			monsters: [],
			items: [],
			walls: [],
		}
		this.init()
	}

	private async init(){
		this.wsServer = await WebSocket( this.server )
		this.mainLoop()
	}

	private mainLoop(){

		if(!this.wsServer.clientsRequestsQueue){ return }
		
		this.requestsQueue = {}
		this.getIterationRequestsQueue()
		
		this.creaturesToUpdateQueue = []
		this.getIterationCreaturesUpdateQueue()

		this.updateCreatures()

		this.sendUpdatesToClients()

		this.wsServer.clientsRequestsQueue = []

		setTimeout(() => { this.mainLoop() }, 50)

	}

	private sendUpdatesToClients(){
		for(const creature of this.creaturesToUpdateQueue){
			if(creature.type === 'player'){
				this.wsServer.sendDataToClient({
					name: creature.name,
					key: creature.key
				},{
					game,
					items: [],
					walls: [],
					creatures: this.summary.players,
				})
			}
		}
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
				// this.requestsQueue[player.name].push(request)
			}
		}
	}

	private getIterationCreaturesUpdateQueue(): void{

		for(const player of this.summary.players){

			const nearbyCreatures = [...this.summary.monsters, ...this.summary.players].filter( cr => {

				if(cr.type == 'player' && cr.name === player.name){
					return this.requestsQueue[player.name] ? true : false
				}

				if(cr.type == 'player' && !this.requestsQueue[cr.name] && !this.requestsQueue[player.name]){
					return false
				}

				return Math.abs(cr.position[0] - player.position[0]) < Math.ceil( game.mapSize[0] / 2 ) + 1
					&& Math.abs(cr.position[1] - player.position[1]) < Math.ceil( game.mapSize[1] / 2 ) + 1
			})

			for(const pushingCreature of nearbyCreatures){

				if(!this.creaturesToUpdateQueue.filter(cr => pushingCreature.id == cr.id).length){
					this.creaturesToUpdateQueue.push(pushingCreature)
				}

			}

		}

	}

	private getPlayer(request: any){
		
		for(const player of this.summary.players){
			if(player.name === request.name){
				return player
			}
		}

		return this.addPlayerToGame(request)

	}

	private addPlayerToGame(request:any){
		// const id = this.summary.players.length + this.summary.monsters.length + 1
		const player = new Player(request.name, ++this.uid)
		this.summary.players.push(player)
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

