// const monstersList = require("../../lists/monstersList").data;
const npcsList = require("../../lists/npcsList").data;
// const Player = require("../../components/Creatures/Player")
// const Monster = require("../../components/Creatures/Monster")
const NPC = require("../../components/Creatures/NPC")
const game = require("../../../public/js/gameDetails");

import MonsterProvider from '../../components/Providers/Monsters'
import Monster from '../../components/Creatures/Monster'
import Player from '../../components/Creatures/Player'
// import Creature from '../../components/Creature'
import { monsters, StaticMonster } from '../../lists/monsters'

// const MonstersProvider = require('../../components/Providers/Monsters')

import WebSocket from '../WebSocket/WebSocket'
import { Server } from 'http';
import GameActions from '../../components/Actions/GameActions';

export default class Game {

	private requestsQueue: any = {};
	private wsServer: any;
	private server: Server;
	private creaturesToUpdateQueue: Array<any> = [];
	private uid: number = 1; 
	private game_actions: GameActions
	private loop_no: number = 0

	private creatures: Map<number, Player | Monster >;

	private summary:  {
		// players: Array<typeof Player>,
		players: Array<Player>,
		// monsters: Array<typeof Player>,
		items: Array<typeof Monster>,
		npcs: Array<typeof NPC>,
		walls: Array<any>,
	};

	constructor(server: Server) {

		this.server = server
		this.creatures = new Map()
		this.game_actions = new GameActions()
		// this.initMonsters()
		monsters.map(( monster: StaticMonster ) => {
			this.creatures.set(++this.uid, new Monster(monster))
		})


		this.summary = {
			players: [],
			// monsters: [],
      // monsters: new MonsterProvider().items,
			npcs: [],
			items: [],
			walls: [],
		}
		this.init()
	}

	private async init(){
		this.wsServer = await WebSocket( this.server )
		// this.initMonsters()
		// this.initNPCs()
		this.game_actions.assignSocket(this.wsServer)
		this.game_actions.assignCreatures(this.creatures)

		this.loop()
	}

	private loop(){

		for(const [ uid, creature ] of this.creatures){
			this.game_actions.apply(creature)
			// creature.loop()
		}

		// if(0)

		for(const [token, actions] of this.wsServer.requests){
			const new_player_uid = ++this.uid
			console.log({ token, actions, new_player_uid })
			const new_player = new Player(actions[0].name, new_player_uid, token)
			this.creatures.set(new_player_uid, new_player)
			console.log({ new_player })
		}
		// console.log(this.wsServer.requests)

		// for(const [ uid, creature ] of this.creatures){
		// 	creature.setterLoop()
		// }

		// this.requestsQueue = {}
		// this.getIterationRequestsQueue()
		
		// this.creaturesToUpdateQueue = []
		// this.getIterationCreaturesUpdateQueue()

		// this.updateCreatures()

		// this.sendUpdatesToClients()

		// this.wsServer.clientsRequestsQueue = []

		// if(++this.loop_no < 4){
			setTimeout(() => {
				this.loop()
			}, 300)
		// }
			
	}

	private sendUpdatesToClients(){

		this.creaturesToUpdateQueue.forEach(creature => {

			if(creature.type !== 'player') return

			const player = {
				name: creature.name,
				key: creature.key
			}

			const data = {
				game,
				items: [],
				walls: [],
				creatures: this.creaturesToUpdateQueue,
			}

			this.wsServer.sendDataToClient(player, data)

		})
	}

	private initNPCs(){
		
		this.summary.npcs = npcsList.map(( npc: any ) => {
			return new NPC(npc.name, ++this.uid, npc.position)
		})

	}

	// private initMonsters(){


	// 	monsters.map(( monster: StaticMonster ) => {
  //     this.creatures.set(++this.uid, new Monster(monster))
	// 	})
	// 	// this.summary.monsters = monstersList.map(( monster: any ) => {
	// 	// 	return new Monster(monster.name, ++this.uid, monster.position)
	// 	// })

	// }

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

			// console.log({ request })

			// creature.update(request, this.creaturesToUpdateQueue, [], [])
			
		}
	}

	// private getIterationRequestsQueue(): void{
	// 	for(const request of this.wsServer.clientsRequestsQueue){
	// 		const player = this.getPlayer(request)
	// 		if(!this.requestsQueue[player.name]){
	// 			this.requestsQueue[player.name] = request
	// 		}
	// 	}
	// }

	private getIterationCreaturesUpdateQueue(): void{

		for(const player of this.summary.players){
			let areNearestUpdated = false
			// const nearbyCreatures = [...this.summary.monsters, ...this.summary.npcs, ...this.summary.players]
			const nearbyCreatures = [ ...this.summary.npcs, ...this.summary.players]
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

			// if(areNearestUpdated && !this.creaturesToUpdateQueue.filter(cr => player.id == cr.id).length){
			// 	this.creaturesToUpdateQueue.push(player)
			// }

		}

	}

	// private getPlayer(request: any){
		
	// 	for(const player of this.summary.players){
	// 		if(player.name === request.name){
	// 			return player
	// 		}
	// 	}

	// 	console.log({request})

	// 	const player_uid = ++this.uid
	// 	const player = new Player(request.name, player_uid)
	// 	this.creatures.set(player_uid, player)
	// 	this.summary.players.push(player)
	// 	return player

	// }

}

