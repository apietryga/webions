const func = require('../../public/js/functions')
const game = require("../../public/js/gameDetails");
const wm = { // walls management
  list : [],
  update(output,callback){
    for(const [i,mwall] of this.list.entries()){
      if(!func.isSet(mwall[3]) || mwall[3] <= game.time.getTime()){
        this.list.splice(i,1);
      }
    }
    output.walls = this.list;
    callback(output);
  }
}
module.exports = wm