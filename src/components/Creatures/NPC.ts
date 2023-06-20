const NPCModel = require('../Creature')
const npcsTypes = require("../../types/npcsTypes");

module.exports = class NPC extends NPCModel {

	constructor(name: string, id: number, position: Array<number>){
		
		super(name, id, 'monster')
		this.setPosition(position)
		this.loadProperties(npcsTypes)

	}


}