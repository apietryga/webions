// const Creature_player = require('./Creature')
import Creature from '../Creature'
const playersList = require("../../lists/playersList");

// module.exports = class Player extends Creature_player {
export default class Player extends Creature {

	public assignable_properties: any;
	private param: any;
	private direction: any;
	public id: number; // get rid of this
	public serverUpdating: Object = {}

	constructor(name:string, id: number, token: string){

		super(name, id, 'player')
		
		console.log('player constructor', name, id)
		this.id = id
		this.token = token
		console.log('end of player constructor')
		// this.loadProperties(playersList)
	}

	public loop(){

	}

	assignProperties(): void {
		console.log('assign_properites')
		this.assignable_properties = playersList
	}

	handleWalking(phantomPos: Array<number>): Array<number>{
		

		let key;

		if(typeof this.param.controls != "undefined" && this.param.controls.length > 0){
			for(const k of [37,39,38,40]){
				if(this.param.controls.includes(k)){
					key = k;
					break;
				}
			}
		}

		switch (key) {
			case 39: phantomPos[0]++;this.direction = 2; break; // right key
			case 37: phantomPos[0]--;this.direction = 3; break; // left key
			case 38: phantomPos[1]--;this.direction = 0; break; // up key
			case 40: phantomPos[1]++;this.direction = 1; break; // down key
		}
		// console.log({ ...this.param, ...phantomPos, ...this.position})
		console.log('param:', this.param, 'phantom', phantomPos, 'rl', this.position)
		return phantomPos;

	}

}