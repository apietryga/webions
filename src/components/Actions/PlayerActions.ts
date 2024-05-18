import Player from "../Creatures/Player"

export default class PlayerActions {

    private properties

    constructor(properties: any){
        this.properties = properties
    }

    handleAction(action: any){

        Object.keys(action).forEach((key: string) => {
            if(key === 'controls' && typeof action[key] == 'object'){
                this.handleControls(action[key])
            }

        })

    }

    handleControls(controls: Array<number>){

        controls.forEach(control => {

            if([37, 39, 38, 40].includes(control)){
                this.walk(control)
            }

        })
        // console.log({ controls })

    }

    walk(key: number){

        const game_time = new Date().getTime()

        if(this.properties.walk > game_time){
            return
        }

        let phantomPos = [...this.properties.position]

        switch (key) {
          case 39: phantomPos[0]++;this.properties.direction = 2; break; // right key
          case 37: phantomPos[0]--;this.properties.direction = 3; break; // left key
          case 38: phantomPos[1]--;this.properties.direction = 0; break; // up key
          case 40: phantomPos[1]++;this.properties.direction = 1; break; // down key
        }

        // console.log({ phantomPos })

        // this.properties.walk = {
        //     time_start: game_time,            
        //     time_end: game_time + Math.round(1000/this.properties.totalSpeed)
        // }
        this.properties.serverUpdating = {
            walk: {
                time_start: game_time,            
                time_end: game_time + Math.round(1000/this.properties.totalSpeed),
                position_start: this.properties.position,
                position_end: phantomPos,

            }
        }

        this.properties.position = phantomPos


        // let isFloor = false;
        // let isStairs = false;
        // let doorAvalible = true;
        // let isWall = false;

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
        // this.text = "There's no way.";
    //   }
    // }

    }

}