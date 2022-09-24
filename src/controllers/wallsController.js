const wm = { // walls management
  list : [],
  update(output,callback){
    for(const [i,mwall] of this.list.entries()){
      if(!func.isSet(mwall[3]) || mwall[3] <= game.time.getTime()){
        this.list.splice(i,1);
      }
    }

    // console.log('walls management')
    // console.log(this.list);
    // output.push(walls);
    output.walls = this.list;
    // if(typeof output.walls != 'undefined'){

    // }else{

    // }
    callback(output);
  }
}
module.exports = wm