const Creature = require('../Creature')

module.exports = class Player extends Creature {

	constructor(name, id){
		super(name, id, 'player')
	}

	


}