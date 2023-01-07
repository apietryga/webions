const itemsList = require("../lists/itemsList").list;
const Item = require("../components/Item");
const game = require("../../public/js/gameDetails")

const im = { // items management
  allItems:[],
  itemsInArea:[],
  init(){
    // get static items
    for(const item of itemsList){
        this.allItems.push(new Item(item));
    }
  },
  update(output,player,callback){
    this.itemsInArea = [];
    for(const item of this.allItems){
      if(Math.abs(player.position[0] - item.position[0]) <= Math.ceil( game.mapSize[0] / 2 )
        && Math.abs(player.position[1] - item.position[1]) <= Math.ceil( game.mapSize[1] / 2 )
      ){
        this.itemsInArea.push(new Item(item));
      }
    }
    output.items = this.itemsInArea.reverse();
    callback(output);
  }
}
module.exports = im