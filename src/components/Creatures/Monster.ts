const MonsterModel = require('../Creature')
const monstersTypes = require("../../types/monstersTypes");

module.exports = class Monster extends MonsterModel {

	constructor(name: string, id: number, position:Array<number>){
		
		super(name, id, 'monster')
		
		this.setPosition(position)
		this.loadProperties(monstersTypes)

	}

}