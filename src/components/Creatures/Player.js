const Creature = require('../Creature')
const playersList = require("../../lists/playersList");

module.exports = class Player extends Creature {

	constructor(name, id){
		super(name, id, 'player')
		this.loadProperties(playersList)
	}

	


}