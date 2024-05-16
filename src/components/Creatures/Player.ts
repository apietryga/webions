import Creature from '../Creature'
const playersList = require("../../lists/playersList");

export default class Player extends Creature {

	public assignable_properties: any;
	public serverUpdating: Object = {}

	constructor(name:string, id: number, token: string){
		super(name, id, 'player', token)
		console.log(this)
		this.token = token
	}

	public loop(actions: Array<Object>){
		console.log('player.loop', actions)
	}

	assignProperties(): void {
		console.log('assign_properites')
		// this.assignable_properties = playersList
	}

}