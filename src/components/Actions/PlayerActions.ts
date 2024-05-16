import Player from "../Creatures/Player"

export default class PlayerActions {

    // private player

    // constructor(player: Player){
    //     this.player = player
    // }

    handleAction(action: any){

        Object.keys(action).forEach((key: string) => {
            if(key === 'controls' && typeof action[key] == 'object'){
                this.handleControls(action[key])
            }

        })

    }

    handleControls(controls: Array<number>){

        controls.forEach(control => {

            if([37].includes(control)){
                this.walk(control)
            }


        })
        console.log({ controls })

    }

    walk(control: number){

    // if(this.walk <= game.time.getTime() && this.health > 0 && this.speed !== false){
    //   let phantomPos = [this.position[0], this.position[1], this.position[2]];
    //   // player walking from pushed keys
    //   let key;if(this.type == "player"){
    //     // get clicked key
    //     if(typeof param.controls != "undefined" && param.controls.length > 0){
    //       // get some of arrow key
    //       for(const k of [37,39,38,40]){
    //         if(param.controls.includes(k)){
    //           key = k;
    //           break;
    //         }
    //       }
    //     }
    //     // set probably future position
    //     switch (key) {
    //       case 39: phantomPos[0]++;this.direction = 2; break; // right key
    //       case 37: phantomPos[0]--;this.direction = 3; break; // left key
    //       case 38: phantomPos[1]--;this.direction = 0; break; // up key
    //       case 40: phantomPos[1]++;this.direction = 1; break; // down key
    //     }
    //   }
    //   let r;  // direction of move
    //   // monsters & npc's walking
    //   if(["monster","npc"].includes(this.type)){
    //     // set walking type (random / follow / escape)
    //     let walkingMode = "random";
    //     // walking modes
    //     if(this.type == "npc"){
    //       if(func.isSet(this.talking)){
    //         walkingMode = "stay";
    //       }else{
    //         walkingMode = "random";
    //       }
    //     }else{
    //       if(isPlayerNear){
    //         if(this.health > 0.2*this.maxHealth && playerInArea.health > 0){
    //           walkingMode = "follow";
    //         }else{
    //           walkingMode = "escape";
    //         }
    //       }  
    //     }
    //     // move monster
    //     if(walkingMode == "follow"){
    //       if(Math.abs(this.position[0] - playerInArea.position[0]) > 1
    //       || Math.abs(this.position[1] - playerInArea.position[1]) > 1){
    //         const routeFinded = func.setRoute(this.position,playerInArea.position,map,creatures,200,walls);
    //         if(routeFinded){
    //           phantomPos[0] = routeFinded[0][0];
    //           phantomPos[1] = routeFinded[0][1];  
    //         }else{
    //           walkingMode = "random";
    //         }
    //       }
    //     }
    //     if(walkingMode == "escape"){
    //       let [monX,monY] = this.position;
    //       let [plaX,plaY] = playerInArea.position; 
    //       let posibilites = [];
    //       if(monX <= plaX){posibilites.push(3);}
    //       if(monX >= plaX){posibilites.push(1);}
    //       if(monY >= plaY){posibilites.push(2);}
    //       if(monY <= plaY){posibilites.push(0);}      
    //       let posibilitesId = Math.round(Math.random()*(posibilites.length-1));
    //       r = posibilites[posibilitesId];

    //       if(this.escapeStuck){
    //         walkingMode = "random";
    //       }
    //       this.escapeStuck = true;
    //     }
    //     if(walkingMode == "random") {
    //       r = Math.floor(Math.random() * 4);
    //     }
    //     if(walkingMode == "stay"){
    //       r = -1;
    //     }
    //     if (r == 0) {phantomPos[1]--;} // up
    //     if (r == 1) {phantomPos[0]++;} // right
    //     if (r == 2) {phantomPos[1]++;} // down
    //     if (r == 3) {phantomPos[0]--;} // left
    //     // r == -1 -> stop, but wait this time
    //     // setting monster direction
    //     if(phantomPos[0] > this.position[0]){this.direction = 2;}        
    //     if(phantomPos[0] < this.position[0]){this.direction = 3;}        
    //     if(phantomPos[1] > this.position[1]){this.direction = 1;}        
    //     if(phantomPos[1] < this.position[1]){this.direction = 0;}
    //   }

    //   // CHEKCKING IF POSITION IS AVAILBLE
    //   let isFloor = false;
    //   let isStairs = false;
    //   let doorAvalible = true;
    //   let isWall = false;

    //   // check grids 
    //   const avalibleGrids = func.equalArr(map.avalibleGrids);
    //   const notAvalibleGrids = func.equalArr(map.notAvalibleGrids);
    //   if(this.type == "player" && !avalibleGrids.includes("stairs")){
    //     avalibleGrids.push("stairs");
    //     notAvalibleGrids.splice(notAvalibleGrids.indexOf("stairs"),1);
    //   }else if(this.type != "player" && avalibleGrids.includes("stairs")){
    //     notAvalibleGrids.push("stairs");
    //   }
    //   // ladder 
    //   if(this.type == "player"){
    //     for(const item of items){
    //       // up
    //       if(func.compareTables(item.position,this.position) && item.name == "Ladder"){
    //         // check if's floor between
    //         let isBetween = false;
    //         for(const grid of map.getGrid([phantomPos[0],phantomPos[1],phantomPos[2]+1])){
    //             isBetween = true;
    //         }
    //         // check if grid next to is avalible
    //         let isNextAvalible = false;
    //         for(const grid of map.getGrid([phantomPos[0],phantomPos[1],phantomPos[2]])){
    //           if(grid[4] == "floors"){
    //             if(grid[4] == "floors"){
    //               isNextAvalible = true;
    //             }
    //           }
    //         }
    //         if(!isBetween){
    //           let isNextAvalible = false;
    //           // check future position
    //           for(const grid of map.getGrid([phantomPos[0]-1,phantomPos[1]-1,phantomPos[2]+1])){
    //             if(grid[4] == "floors"){
    //               isNextAvalible = true;
    //             }
    //           }
    //           if(isNextAvalible){
    //             phantomPos[0]--;
    //             phantomPos[1]--;
    //             phantomPos[2]++;
    //           }
    //         }
    //       }
    //       // down
    //       if(func.compareTables([item.position[0]-1,item.position[1]-1,item.position[2]+1],phantomPos)
    //       && item.name == "Ladder"){
    //         // check if's floor between
    //         let isBetween = false;
    //         for(const grid of map.getGrid(phantomPos)){
    //           // if(grid[4] == "floors"){
    //             isBetween = true;
    //           // }
    //         }
    //         if(!isBetween){
    //           phantomPos[0]++;
    //           phantomPos[1]++;
    //           phantomPos[2]--;  
    //         }

    //       }
    //     }
    //   }
    //   // mwall's
    //   for(const wall of walls){
    //     if(func.compareTables(
    //       [wall[0],wall[1],wall[2]],
    //       phantomPos
    //     )){
    //       isWall = true;
    //       // isFloor = true;
    //     }
    //   }
    //   // check grids 
    //   for(const checkGrid of map.getGrid(phantomPos)){
    //     // for(const checkGrid of map.getGrid(phantomPos)){
    //       if(checkGrid){
    //         if(avalibleGrids.includes(checkGrid[4])){
    //           isFloor = true;
    //         }
    //         if(notAvalibleGrids.includes(checkGrid[4])){
    //           isWall = true;
    //         }
    //         if(checkGrid[4] == "stairs"){
    //           if(["monster","npc"].includes(this.type)){isFloor = false;}
    //           if(this.type == "player"){
    //             isStairs = true;
    //             phantomPos = checkGrid[5];
    //           }
    //         }
    //         if(checkGrid[4] == "doors"){
    //           doorAvalible = false;
    //           if(["monster","npc"].includes(this.type)){isFloor = false;}
    //           // cases when player can pass through
    //           if(this.type == "player" && func.isSet(checkGrid[5])){
    //             // level gate
    //             if(Object.keys(checkGrid[5]).includes("level")){
    //               if(this.skills.level >= checkGrid[5].level){
    //                 doorAvalible = true;
    //               }else{
    //                 this.text = "You need "+checkGrid[5].level+" level to open this doors.";
    //               }
    //             }
    //             // property gate
    //             if(Object.keys(checkGrid[5]).includes("property")){
    //               if(!isNaN(checkGrid[5].property)){
    //                 this.text = "This house costs "+checkGrid[5].property+" gold.";
    //               }else{
    //                 if(checkGrid[5].property == this.name){
    //                   doorAvalible = true;
    //                 }else{
    //                   this.text = checkGrid[5].property+" is the owner of this house";
    //                 }
    //               }
    //             }              
    //           }
    //         }
    //       }
    //   }

    //   if(isWall){isFloor = false;}
    //   if(!doorAvalible){isFloor = false;}

    //   // check items can't walk and walkon
    //   let isItem = false;
    //   let itemText = false;
    //   for(const i of items){
    //     if(func.compareTables(phantomPos,i.position)){
    //       if(func.isSet(i.walkThrow) && i.walkThrow == false){
    //         isItem = true;
    //       }
    //       if(func.isSet(i.walkOn)){
    //         itemText = true;
    //         i.walkOn(this,i,{allItems:allItems});
    //       }
    //     }
    //   }
    //   if(isItem){isFloor = false;}

    //   // monsters & npc's staying
    //   if(!isFloor && ["npc","monster"].includes(this.type)){
    //     // set exhaust
    //     this.walk = game.time.getTime() + Math.round(1000/this.totalSpeed);
    //     this.speed = 0;
    //   }else if(["npc","monster"].includes(this.type)){
    //     this.speed = this.totalSpeed;
    //   }

    //   // check monsters and players on position
    //   for(const c of creatures){
    //     if ((func.compareTables(c.position, phantomPos) && c.health > 0) 
    //         && ((this.type != "player" && isStairs)
    //         ||(this.id != c.id))){
    //       isFloor = false;
    //     }else if(
    //       // when there's other creature on stairs - go on
    //       ["npc","player","monster"].includes(c.type) && isStairs
    //     ){
    //       isFloor = true;
    //       break;
    //     }
    //   }

		// 	// console.log({ param })
		// 	// set new position or display error
    //   if(isFloor && ((this.type == "player" && typeof key != "undefined") 
    //     || (["monster","npc"].includes(this.type) && !func.compareTables(this.position,phantomPos)) )){
		// 		// console.log("EE")
		// 		this.serverUpdating.walk = {
		// 			time_start: game.time.getTime(),
		// 			time_end: game.time.getTime() + Math.round(1000/this.totalSpeed),
		// 			position_start: this.position,
		// 			position_end: phantomPos,
		// 		}		

		// 			// for monsters
    //       delete this.escapeStuck;
    //       // set exhaust
    //       this.walk = game.time.getTime() + Math.round(1000/this.totalSpeed);
    //       this.position = phantomPos;
    //   }else if(this.type == "player" && typeof key != "undefined" && doorAvalible && !itemText){
    //     this.text = "There's no way.";
    //   }
    // }

    }

}