// const old_creature = require('../Creature')
const func = require("../../../public/js/functions");
const GameMap = require("../../../public/js/map");
const map = new GameMap();

export default abstract class Creature {
// export default class Creature extends old_creature {

	abstract assignable_properties: any; 

	public position: Array<number> | null
	public name: string
	public id: number
	public token: string = ''

	constructor(name: string, id: number, type: string = "monster"){

		console.log('creature contructor', name)
		this.name = name;
		this.id = id
		this.position = null;
			// super(name, id, type)
		this.assignProperties()
		this.loadProperties()
		
	}

	abstract assignProperties(): void;
	abstract loop(): void;

	loadProperties(){
		const props = this.assignable_properties.filter((item: any) => item.name === this.name )?.[0]

		console.log("Props for " + props.name, props)
			if(props){
		Object.assign(this, props)
				// for(const key in props){
				// 	this[key] = props[key]
				// }
			}
	}

	public setterLoop(){
		console.log('setter')
		
	}

	public getterLoop(){

	}

  // abstract loop(){
  //   // console.log('loop')
  // }

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