const MonsterModel = require('../Creature')
const monstersTypes = require("../../types/monstersTypes");

module.exports = class Monster extends MonsterModel {

	constructor(name: string, id: number, position:Array<number>){
		
		super(name, id, 'monster')
		
		this.setPosition(position)
		this.loadProperties(monstersTypes)

	}

	handleWalking(phantomPos: Array<number>): Array<number>{

		let r;  // direction of move
		let walkingMode = "random";
		// walking modes
		if(this.isPlayerNear){
			if(this.health > 0.2*this.maxHealth && this.playerInArea.health > 0){
				walkingMode = "follow";
			}else{
				walkingMode = "escape";
			}
		}  
		// move monster
		if(walkingMode == "follow"){
			if(Math.abs(this.position[0] - this.playerInArea.position[0]) > 1
			|| Math.abs(this.position[1] - this.playerInArea.position[1]) > 1){
				const routeFinded = this.func.setRoute(this.position,this.playerInArea.position,this.map,this.creatures,200,this.walls);
				if(routeFinded){
					phantomPos[0] = routeFinded[0][0];
					phantomPos[1] = routeFinded[0][1];  
				}else{
					walkingMode = "random";
				}
			}
		}
		if(walkingMode == "escape"){
			let [monX,monY] = this.position;
			let [plaX,plaY] = this.playerInArea.position; 
			let posibilites = [];
			if(monX <= plaX){posibilites.push(3);}
			if(monX >= plaX){posibilites.push(1);}
			if(monY >= plaY){posibilites.push(2);}
			if(monY <= plaY){posibilites.push(0);}      
			let posibilitesId = Math.round(Math.random()*(posibilites.length-1));
			r = posibilites[posibilitesId];

			if(this.escapeStuck){
				walkingMode = "random";
			}
			this.escapeStuck = true;
		}
		if(walkingMode == "random") {
			r = Math.floor(Math.random() * 4);
		}
		if(walkingMode == "stay"){
			r = -1;
		}
		if (r == 0) {phantomPos[1]--;} // up
		if (r == 1) {phantomPos[0]++;} // right
		if (r == 2) {phantomPos[1]++;} // down
		if (r == 3) {phantomPos[0]--;} // left
		// r == -1 -> stop, but wait this time
		// setting monster direction
		if(phantomPos[0] > this.position[0]){this.direction = 2;}        
		if(phantomPos[0] < this.position[0]){this.direction = 3;}        
		if(phantomPos[1] > this.position[1]){this.direction = 1;}        
		if(phantomPos[1] < this.position[1]){this.direction = 0;}
		
		return phantomPos

	}

}