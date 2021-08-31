const dbFile = require("../json/playersList.json");
class dbConnect{
  constructor(){
    this.base = dbFile;

  }

}

module.exports = dbConnect;