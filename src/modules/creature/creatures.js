// const game = require("../../../public/js/gameDetails");
// const func = require("../../../public/js/functions");

// module.exports = {
//   nearbyCreatures( allCreatures, position, id){
//     return allCreatures.filter( cr => {
//       return Math.abs(cr.position[0] - position[0]) < 7
//         && Math.abs(cr.position[1] - position[1]) < 7
//         && id != cr.id
//     })

//   },
//   mwallDrop( autoMWDrop, exhaust, lastMWall, position, text, mana, skills, updateSkills, param, exhaustTime, walls ){
//     if(( autoMWDrop || param?.mwallDrop ) && exhaust.mwall <= game.time.getTime() ){ 
//       const mwallManaBurn = 250;
//       const wallLifeTime = 15; // seconds
//       const addExhaust = [ game.time.getTime() + ( wallLifeTime * 1000 ) ];
//       const dropMWall = ( mwallManaBurn, addExhaust ) => {
//         // check if wall is in area
//         if(Math.abs(position[0] - lastMWall[0]) >= 6 || Math.abs(position[1] - lastMWall[1]) >= 6 || position[2] != lastMWall[2]){
//           text = "You can't drop wall there."
//           autoMWDrop = false;
//           return 0;
//         }
//         // check if wall exists
//         let wallExists = false;
//         for(const wall of walls){
//           if(func.compareTables([wall[0],wall[1],wall[2]],[lastMWall[0],lastMWall[1],lastMWall[2]])){
//             wallExists = true;
//             wall[3] = addExhaust[0];
//             break;
//           }
//         }

//         // if(func.isPos(map,this)){
//         mana -= mwallManaBurn;
//         lastMWall[3] = addExhaust[0];
//         text = "Magic Wall takes "+mwallManaBurn+" mana.";
//         skills.magic_summary += mwallManaBurn;
//         // updateSkills(db);  
//         updateSkills(dbconnected);  
//         if(!wallExists){
//           walls.push(lastMWall)
//         }

//         // }else{
//         //   text = "Sorry it's not possible."
//         // }

//       }
//       if(mana >= mwallManaBurn){
//         if(func.isSet(param.mwallDrop)){
//           // mwall dropping from key
//           lastMWall = param.mwallDrop.concat(addExhaust);
//           dropMWall(mwallManaBurn,addExhaust);
//         }else if(func.isSet(lastMWall) && autoMWDrop){
//           dropMWall(mwallManaBurn,addExhaust);
//         }else{
//           text = "Set the wall first.";
//           autoMWDrop = false;
//         }
//       }else{
//         text = "You need "+mwallManaBurn+" mana";
//       }
//       exhaust.mwall = game.time.getTime() + exhaustTime;
//     }





//   }
// }