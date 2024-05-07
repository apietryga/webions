// const monstersList = require("../../lists/monstersList").data;
import monsters from '../../lists/monsters'

import Provider from '../Provider'
// const Provider = require('../Provider')
import Monster from '../Creatures/Monster'
import Creature from '../Creature'

interface StaticMonster{
  name: string,
  position: Array<number>
}

export default class MonstersProvider extends Provider{

  // constructor(){
  //   items
  // }
  public items: Array<Monster>

  constructor(){
    super()
    this.items = monsters.map((monster: StaticMonster) => {
      return new Monster(monster.name, ++this.uid, monster.position)
    })
  }

  // public init(){
  //   console.log('monster provider init')

  //   // this.summary.monsters = monstersList.map(( monster: any ) => {
	// 	// 	return new Monster(monster.name, ++this.uid, monster.position)
	// 	// })

  //   // return this.items = []
  //   // return this.items = monsters.map((monster: Monster) => {
  //   //   return new Monster(monster.name, ++this.uid, monster.position)
  //   // })
  //   // return []
  // }

}