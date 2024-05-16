const NPCModel = require('../Creature')
const npcsTypes = require("../../types/npcsTypes");


import Creature from '../Creature'


// module.exports = class NPC extends NPCModel {
export default class NPC extends Creature {

	public assignable_properties: any;

	constructor(name: string, id: number, position: Array<number>){
		
		super(name, id, 'monster')
		// this.setPosition(position)
		// this.loadProperties(npcsTypes)

	}

	assignProperties(): void {
		this.assignable_properties = npcsTypes
	  }
	
	  loop(){
		// console.log('monster_loop')
		// this.update();
	
	  }

	// handleWalking(phantomPos: Array<number>): Array<number>{

	// 	const r = this.talking ? -1 : Math.floor(Math.random() * 4);

	// 	if (r == 0) {phantomPos[1]--;} // up
	// 	if (r == 1) {phantomPos[0]++;} // right
	// 	if (r == 2) {phantomPos[1]++;} // down
	// 	if (r == 3) {phantomPos[0]--;} // left
	// 	// r == -1 -> stop, but wait this time

	// 	if(phantomPos[0] > this.position[0]){this.direction = 2;}        
	// 	if(phantomPos[0] < this.position[0]){this.direction = 3;}        
	// 	if(phantomPos[1] > this.position[1]){this.direction = 1;}        
	// 	if(phantomPos[1] < this.position[1]){this.direction = 0;}

	// 	return phantomPos

	// }
	
	
}