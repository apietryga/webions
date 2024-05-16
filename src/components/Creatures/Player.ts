import PlayerActions from '../Actions/PlayerActions';
import Creature from '../Creature'
const playersList = require("../../lists/playersList");

export default class Player extends Creature {

	public assignable_properties: any;
	public serverUpdating: Object = {}

	// public autoMWDrop: any
	// public autoShot: any
	// public colors: any
	// public email: any
	// public eq: any
	// public lastDeaths: any
	// public lastMWall: any
	// public password: any
	// public quests: any
	// public sex: any
	// public token: any
	// public properties: any

	// private actions: PlayerActions
	
	constructor(name:string, id: number, token: string){
		super(name, id, 'player', token)
		// console.log(this)
		this.token = token
		// this.actions = new PlayerActions(this)
	}

	public loop(actions: Array<Object>){
		console.log('player.loop', actions)

		// actions.forEach(action => {
		// 	this.actions.handleAction(action)
		// 	// console.log({ action })
		// })

	}

	assignProperties(): void {
		// console.log('assign_properites', playersList)
		console.log('assign_properites')
		// this.assignable_properties = playersList

		const current_player = playersList.find((player:any) => player.token == this.token)
		// console.log({current_player})
		this.name = current_player.name
		this.properties.position = current_player.position

		// this.sprite = current_player.sprite
		// this.speed = current_player.speed
		// this.skills = current_player.skills
		// this.sex = current_player.sex
		// this.sex = current_player.sex
		this.properties.autoMWDrop = current_player.autoMWDrop //: false
		this.properties.autoShot = current_player.autoShot //: true
		this.properties.colors = current_player.colors //: {head: Array(3), chest: Array(3), legs: Array(3), foots: Array(3)}
		this.properties.email = current_player.email //: 'antek.pietryga@gmail.com'
		this.properties.eq = current_player.eq //: {hd: {…}, bp: {…}, nc: false, ch: {…}, lh: {…}, …}
		this.properties.health = current_player.health //: 4110
		this.properties.lastDeaths = current_player.lastDeaths //: (3) [{…}, {…}, {…}]
		this.properties.lastFrame = current_player.lastFrame //: 1664618504219
		this.properties.lastMWall = current_player.lastMWall //: (4) [56, -20, -2, 1641930243542]
		this.properties.mana = current_player.mana //: 3310
		this.properties.maxHealth = current_player.maxHealth //: 3110
		this.properties.maxMana = current_player.maxMana //: 3110
		// this.properties.name = current_player.name //: 'GM'
		this.properties.password = current_player.password //: '$2b$10$.8M61VyIgCxK7M2wMlZHgewYB.lAoCNjpCUsJ0unSU0w06DBgupKa'
		this.properties.position = current_player.position //: (3) [13, -27, 1]
		this.properties.quests = current_player.quests //: (56) ['Random Item', 'Random Item', 'Random Item', 'ladder', 'ladder', 'ladder', 'ladder', 'ladder', 'Random Item', 'Simple Boots', 'ladder', 'Random Item', 'ladder', 'ladder', 'ladder', 'ladder', 'ladder', 'Random Item', 'ladder', 'ladder', 'Random Item', 'Simple Shield', 'Simple Shield', 'Simple Shield', 'Simple Shield', 'ladder', 'ladder', 'ladder', 'Random Item', 'Random Item', 'Random Item', 'Random Item', 'Random Item', 'Random Item', 'Random Item', 'Random Item', 'Random Item', 'Random Item', 'Random Item', 'Random Item', 'Random Item', 'Random Item', 'Random Item', 'Random Item', 'Random Item', 'Random Item', 'Simple Shield', 'Simple Shield', 'Blessed Shield', 'King Boots', 'Backpack', 'Backpack', 'Backpack', 'King Legs', 'Wand of Destiny', 'Magic Hat']
		this.properties.redTarget = current_player.redTarget //: 65
		this.properties.sex = current_player.sex //: 'male'
		this.properties.skills = current_player.skills //: {level: 301, exp: 27005870, fist: 19, fist_summary: 5849, dist: 1001, …}
		this.properties.speed = current_player.speed //: 5
		this.properties.sprite = current_player.sprite //: 'gm'
		// this.token = current_player.token //: 'zhxh9ivaxg'
		
	}

}