const Creature = require('../Creature')
const monstersTypes = require("../../types/monstersTypes");

module.exports = class Monster extends Creature {

	constructor(name, id, position){
		
		super(name, id, 'monster')
		
		this.setPosition(position)
		this.loadProperties(monstersTypes)

	}

	// setPosition(position){
	// 	if(position){
	// 		this.position = position
	// 	}
	// }	


}