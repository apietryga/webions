const func = require("../../public/js/functions");
const GameMap = require("../../public/js/map");
const map = new GameMap();

export default abstract class Creature {

	abstract assignable_properties: any; 

	// public position: Array<number> | null
	public name: string
	public id: number
	public token: string = ''
	public type: string

	public properties: any


	// public health: any
	// public mana: any
	// public maxHealth: any
	// public maxMana: any

	// public lastFrame: any
	// public redTarget: any
	// public skills: any
	// public speed: any
	// public sprite: any

	constructor(name: string, id: number, type: string = "monster", token:string = ''){
		// console.log('creature start', this)
		this.name = name;
		this.id = id
		// this.position = [0, 0, 0];
		this.token = token
		this.type = type
		this.properties = {}
		console.log('creature end', this)
		this.assignProperties()
	}

	abstract assignProperties(): void
	abstract loop(actions: Array<Object>): void

	loadProperties(){

		const props = this.assignable_properties.filter((item: any) => item.name === this.name )?.[0]
		console.log("Props for " + props.name, props)
		if(props){
			Object.assign(this.properties, props)
			// for(const key in props){
			// 	this[key] = props[key]
			// }
		}

	}

	sendToClient(){

		return true

	}

	exposeProperties(){
		return {
			id: this.id,
			name: this.name,
			type: this.type,
			 
			position: this.properties.position,
			// colors: this.properties.colors,
			// direction: this.properties.direction,
			
			health: this.properties.health, 
			totalHealth: this.properties.maxHealth, 
			lastFrame: this.properties.lastFrame, 
			mana: this.properties.mana, 
			totalMana: this.properties.maxMana, 
			redTarget: this.properties.redTarget, 
			skills: this.properties.skills, 
			speed: this.properties.speed, 
			sprite: this.properties.sprite, 

			direction: 2,

			// "walk": 1704496691064,
			// "totalSpeed": 3.5,
			// "restore": false,
			// "exhaustTime": 1000,
			// "exhaust": {
			// 	"fist": 1703619284899,
			// 	"dist": 1703980874249,
			// 	"mwall": 0,
			// 	"heal": 1702674125925,
			// 	"say": 0
			// },
			// "autoShot": false,
			// "autoMWDrop": false,
			// "quests": [],
			// "colors": {
			// 	"head": [240, 127, 13],
			// 	"chest": [240, 240, 13],
			// 	"legs": [240, 13, 13],
			// 	"foots": [212, 212, 212]
			// },
			// "eq": {
			// 	"hd": {
			// 		"type": "item",
			// 		"name": "Magic Hat",
			// 		"sprite": "items",
			// 		"spriteNr": 13,
			// 		"handle": [
			// 			"hd"
			// 		],
			// 		"pickable": true,
			// 		"mana": 400,
			// 		"manaRegen": 50,
			// 		"position": [
			// 			43,
			// 			1,
			// 			-1
			// 		],
			// 		"actionType": "pickUp",
			// 		"visibleFloor": -1,
			// 		"field": "hd",
			// 		"pos": [
			// 			43,
			// 			1,
			// 			-1
			// 		]
			// 	},
			// 	"bp": {
			// 		"name": "Backpack",
			// 		"sprite": "items",
			// 		"spriteNr": 0,
			// 		"cap": 8,
			// 		"handle": [
			// 			"bp"
			// 		],
			// 		"pickable": true,
			// 		"position": [
			// 			34,
			// 			0,
			// 			0
			// 		],
			// 		"actionType": "drop",
			// 		"field": "bp",
			// 		"in": [
			// 			{
			// 				"name": "Coins",
			// 				"amount": 600,
			// 				"position": [
			// 					81,
			// 					-16,
			// 					1
			// 				],
			// 				"sprite": "coins",
			// 				"spriteNr": 1,
			// 				"handle": [
			// 					"lh",
			// 					"rh"
			// 				],
			// 				"pickable": true
			// 			},
			// 			{
			// 				"name": "Coins",
			// 				"amount": 53,
			// 				"position": [
			// 					71,
			// 					12,
			// 					1
			// 				],
			// 				"sprite": "coins",
			// 				"spriteNr": 1,
			// 				"handle": [
			// 					"lh",
			// 					"rh"
			// 				],
			// 				"pickable": true
			// 			}
			// 		]
			// 	},
			// 	"nc": {
			// 		"type": "item",
			// 		"name": "Random Item",
			// 		"sprite": "items",
			// 		"spriteNr": 15,
			// 		"handle": [
			// 			"lh",
			// 			"rh",
			// 			"bp",
			// 			"nc",
			// 			"hd",
			// 			"ch",
			// 			"lg",
			// 			"ft"
			// 		],
			// 		"pickable": true,
			// 		"randStats": [
			// 			{
			// 				"speed": "0 - 3"
			// 			},
			// 			{
			// 				"mana": "0 - 100"
			// 			},
			// 			{
			// 				"manaRegen": "0 - 50"
			// 			},
			// 			{
			// 				"health": "0 - 200"
			// 			},
			// 			{
			// 				"def": "0 - 100"
			// 			}
			// 		],
			// 		"mana": 76,
			// 		"manaRegen": 31,
			// 		"health": 129,
			// 		"def": 48,
			// 		"position": [
			// 			36,
			// 			-11,
			// 			-1
			// 		],
			// 		"actionType": "drop",
			// 		"field": "bp",
			// 		"in": [],
			// 		"pos": [
			// 			51,
			// 			-11,
			// 			1
			// 		]
			// 	},
			// 	"ch": {
			// 		"type": "item",
			// 		"name": "King Armor",
			// 		"sprite": "items",
			// 		"spriteNr": 7,
			// 		"handle": [
			// 			"ch"
			// 		],
			// 		"pickable": true,
			// 		"def": 100,
			// 		"position": [
			// 			52,
			// 			-12,
			// 			1
			// 		],
			// 		"actionType": "pickUp",
			// 		"visibleFloor": 7,
			// 		"field": "ch",
			// 		"pos": [
			// 			52,
			// 			-12,
			// 			1
			// 		]
			// 	},
			// 	"lh": {
			// 		"type": "item",
			// 		"name": "Simple Shield",
			// 		"sprite": "items",
			// 		"spriteNr": 11,
			// 		"handle": [
			// 			"lh",
			// 			"rh"
			// 		],
			// 		"pickable": true,
			// 		"def": 20,
			// 		"position": [
			// 			34,
			// 			-10,
			// 			0
			// 		],
			// 		"actionType": "pickUp",
			// 		"visibleFloor": 0,
			// 		"field": "lh",
			// 		"pos": [
			// 			34,
			// 			-10,
			// 			0
			// 		]
			// 	},
			// 	"rh": {
			// 		"type": "item",
			// 		"name": "Wand of Destiny",
			// 		"sprite": "items",
			// 		"fist": 100,
			// 		"dist": 100,
			// 		"spriteNr": 10,
			// 		"manaRegen": 100,
			// 		"handle": [
			// 			"lh",
			// 			"rh"
			// 		],
			// 		"pickable": true,
			// 		"position": [
			// 			36,
			// 			-10,
			// 			-1
			// 		],
			// 		"actionType": "drop",
			// 		"visibleFloor": -1,
			// 		"field": "rh",
			// 		"pos": [
			// 			54,
			// 			-7,
			// 			1
			// 		]
			// 	},
			// 	"lg": {
			// 		"type": "item",
			// 		"name": "Simple Legs",
			// 		"sprite": "items",
			// 		"spriteNr": 4,
			// 		"handle": [
			// 			"lg"
			// 		],
			// 		"pickable": true,
			// 		"manaRegen": 10,
			// 		"position": [
			// 			146,
			// 			7,
			// 			1
			// 		],
			// 		"actionType": "pickUp",
			// 		"visibleFloor": 5,
			// 		"field": "lg"
			// 	},
			// 	"ft": {
			// 		"type": "item",
			// 		"name": "Simple Boots",
			// 		"sprite": "items",
			// 		"spriteNr": 5,
			// 		"handle": [
			// 			"ft"
			// 		],
			// 		"pickable": true,
			// 		"speed": 1,
			// 		"position": [
			// 			32,
			// 			-23,
			// 			0
			// 		],
			// 		"actionType": "pickUp",
			// 		"visibleFloor": 0,
			// 		"field": "ft"
			// 	}
			// },
			// "manaRegenValue": 0,
			// "manaRegenExhoust": 1704496693329,
			// "locker": {
			// 	"name": "Locker",
			// 	"in": [],
			// 	"cap": 10,
			// 	"field": "locker"
			// },
			// "baseSpeed": 3,
			// "lastMWall": [],
			// "text": "",
			// "focus": true,
			// "lockerOpened": false,
			// "totalDef": 256,
			// "totalFist": 288,
			// "totalDist": 289,
			// "totalMana": 1086,
			// "totalManaRegen": 191,
			// "shotTarget": 5,
			// "bulletOnTarget": 1703980873549


		}
	}

	// walking(){

	// 	if(this.walk >= this.time 
	// 	|| this.health <= 0 || !this.speed
	// 	|| (this.type === 'player' && !this.param?.controls)){
	// 		return null
	// 	}

	// 	this.phantomPos = this.handleWalking([...this.position])
		
	// 	if(!this.isPosAvalible()){
	// 		this.serverUpdating.text = "There's no way."
	// 		return null
	// 	}

	// 	// this.phantomPos = this.handleSpecialGrids(phantomPos)

	// 	// console.log(this.name, this.phantomPos)
	// 	// ladder 
	// 	// if(this.type == "player"){
	// 	//   for(const item of items){
	// 	//     // up
	// 	//     if(func.compareTables(item.position,this.position) && item.name == "Ladder"){
	// 	//       // check if's floor between
	// 	//       let isBetween = false;
	// 	//       for(const grid of map.getGrid([phantomPos[0],phantomPos[1],phantomPos[2]+1])){
	// 	//           isBetween = true;
	// 	//       }
	// 	//       // check if grid next to is avalible
	// 	//       let isNextAvalible = false;
	// 	//       for(const grid of map.getGrid([phantomPos[0],phantomPos[1],phantomPos[2]])){
	// 	//         if(grid[4] == "floors"){
	// 	//           if(grid[4] == "floors"){
	// 	//             isNextAvalible = true;
	// 	//           }
	// 	//         }
	// 	//       }
	// 	//       if(!isBetween){
	// 	//         let isNextAvalible = false;
	// 	//         // check future position
	// 	//         for(const grid of map.getGrid([phantomPos[0]-1,phantomPos[1]-1,phantomPos[2]+1])){
	// 	//           if(grid[4] == "floors"){
	// 	//             isNextAvalible = true;
	// 	//           }
	// 	//         }
	// 	//         if(isNextAvalible){
	// 	//           phantomPos[0]--;
	// 	//           phantomPos[1]--;
	// 	//           phantomPos[2]++;
	// 	//         }
	// 	//       }
	// 	//     }
	// 	//     // down
	// 	//     if(func.compareTables([item.position[0]-1,item.position[1]-1,item.position[2]+1],phantomPos)
	// 	//     && item.name == "Ladder"){
	// 	//       // check if's floor between
	// 	//       let isBetween = false;
	// 	//       for(const grid of map.getGrid(phantomPos)){
	// 	//         // if(grid[4] == "floors"){
	// 	//           isBetween = true;
	// 	//         // }
	// 	//       }
	// 	//       if(!isBetween){
	// 	//         phantomPos[0]++;
	// 	//         phantomPos[1]++;
	// 	//         phantomPos[2]--;  
	// 	//       }

	// 	//     }
	// 	//   }
	// 	// }
	// 	// mwall's
	// 	// for(const wall of walls){
	// 	//   if(func.compareTables(
	// 	//     [wall[0],wall[1],wall[2]],
	// 	//     phantomPos
	// 	//   )){
	// 	//     isWall = true;
	// 	//     // isFloor = true;
	// 	//   }
	// 	// }
	// 	// check grids 
	

	// 	// check items can't walk and walkon
	// 	let isItem = false;
	// 	let itemText = false;
	// 	// for(const i of items){
	// 	//   if(func.compareTables(phantomPos,i.position)){
	// 	//     if(func.isSet(i.walkThrow) && i.walkThrow == false){
	// 	//       isItem = true;
	// 	//     }
	// 	//     if(func.isSet(i.walkOn)){
	// 	//       itemText = true;
	// 	//       i.walkOn(this,i,{allItems:allItems});
	// 	//     }
	// 	//   }
	// 	// }
	// 	// if(isItem){isFloor = false;}

	// 	// monsters & npc's staying
	// 	// if(!isFloor && ["npc","monster"].includes(this.type)){
	// 		// set exhaust
	// 		// this.walk = game.time.getTime() + Math.round(1000/this.totalSpeed);
	// 		// this.speed = 0;
	// 	// }else if(["npc","monster"].includes(this.type)){
	// 		// this.speed = this.totalSpeed;
	// 	// }

	// 	// check monsters and players on position
	// 	// for(const c of creatures){
	// 	//   if ((func.compareTables(c.position, phantomPos) && c.health > 0) 
	// 	//       && ((this.type != "player" && isStairs)
	// 	//       ||(this.id != c.id))){
	// 	//     isFloor = false;
	// 	//   }else if(
	// 	//     // when there's other creature on stairs - go on
	// 	//     ["npc","player","monster"].includes(c.type) && isStairs
	// 	//   ){
	// 	//     isFloor = true;
	// 	//     break;
	// 	//   }
	// 	// }

	// 	// console.log({ param })
	// 	// set new position or display error
	// 	// if(isFloor && ((this.type == "player" && typeof key != "undefined") 
	// 	// if(isFloor && ((this.type == "player") 
	// 	// 	|| (["monster","npc"].includes(this.type) && !func.compareTables(this.position,phantomPos)) )){
	// 		// console.log("EE")
	// 		this.serverUpdating.walk = {
	// 			time_start: this.time,
	// 			time_end: this.time + Math.round(1000/this.totalSpeed),
	// 			position_start: this.position,
	// 			position_end: this.phantomPos,
	// 		}		

	// 			// for monsters
	// 			delete this.escapeStuck;
	// 			// set exhaust
	// 			this.walk = this.time + Math.round(1000/this.totalSpeed);
	// 			this.position = this.phantomPos;
	// 	// }else if(this.type == "player" && typeof key != "undefined" && doorAvalible && !itemText){
	// 	// 	this.text = "There's no way.";
	// 	// }
	// }

	// handleSpecialGrids(){ 
	// // handleSpecialGrids(phantomPos){ 
	// // handleSpecialGrids(phantomPos: Array<number>): Array<number>{

	// 	return this.phantomPos
	// }

	// isPosAvalible(){
	// 	let isFloor = false;
	// 	// let isStairs = false;
	// 	let doorAvalible = true;
	// 	// let isWall = false;

	// 	// get grids 
	// 	const avalibleGrids = func.equalArr(map.avalibleGrids);
	// 	const notAvalibleGrids = func.equalArr(map.notAvalibleGrids);
	// 	if(this.type == "player" && !avalibleGrids.includes("stairs")){
	// 		avalibleGrids.push("stairs");
	// 		notAvalibleGrids.splice(notAvalibleGrids.indexOf("stairs"),1);
	// 	}else if(this.type != "player" && avalibleGrids.includes("stairs")){
	// 		notAvalibleGrids.push("stairs");
	// 	}

	// 	for(const checkGrid of map.getGrid(this.phantomPos)){
	// 		if(!checkGrid){ continue }
	// 		// for(const checkGrid of map.getGrid(phantomPos)){
	// 		// if(checkGrid){
	// 		if(avalibleGrids.includes(checkGrid[4])){
	// 			isFloor = true;
	// 		}
	// 		if(notAvalibleGrids.includes(checkGrid[4])){
	// 			// isWall = true;
	// 			return false;
	// 		}
	// 		if(checkGrid[4] == "stairs"){
	// 			// if(["monster","npc"].includes(this.type)){isFloor = false;}
	// 			if(this.type == "player"){
	// 				// isStairs = true;
	// 				// phantomPos = checkGrid[5];
	// 				this.phantomPos = checkGrid[5];
	// 			}
	// 		}
	// 		if(checkGrid[4] == "doors"){
	// 			doorAvalible = false;
	// 			if(["monster","npc"].includes(this.type)){isFloor = false;}
	// 			// cases when player can pass through
	// 			if(this.type == "player" && func.isSet(checkGrid[5])){
	// 				// level gate
	// 				if(Object.keys(checkGrid[5]).includes("level")){
	// 					if(this.skills.level >= checkGrid[5].level){
	// 						doorAvalible = true;
	// 					}else{
	// 						this.text = "You need "+checkGrid[5].level+" level to open this doors.";
	// 					}
	// 				}
	// 				// property gate
	// 				if(Object.keys(checkGrid[5]).includes("property")){
	// 					if(!isNaN(checkGrid[5].property)){
	// 						this.text = "This house costs "+checkGrid[5].property+" gold.";
	// 					}else{
	// 						if(checkGrid[5].property == this.name){
	// 							doorAvalible = true;
	// 						}else{
	// 							this.text = checkGrid[5].property+" is the owner of this house";
	// 						}
	// 					}
	// 				}              
	// 			}
	// 		}
	// 		// }
	// 	}

	// 	// if(isWall){isFloor = false;}
	// 	// if(!doorAvalible){isFloor = false;}

	// 	if(!isFloor || !doorAvalible){
	// 		return false
	// 	}

	// 	return true

	// }

}