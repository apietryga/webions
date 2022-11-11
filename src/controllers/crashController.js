const dbConnect = require('../database/dbconnect')
const dbc = new dbConnect();

// SAVE PLAYERS BEFORE SERVER CRASH
const shutdown = signal => {
  return async err => {
    console.error({ title: "CRASH CONTROLLER", err })
    if(err.message === 'Socket closed unexpectedly'){
      // redis shut down, so set db again
      global.dbconnected = dbc[await dbc.init()]
    }
    for(const player of cm.players.list){
      player.console = "Server will restart in few seconds.";
      global.dbconnected.update(player);
    }
    console.log('PLAYERS SAVED AFTER '+signal);
  };
}

process.on('SIGTERM', shutdown('SIGTERM'))
.on('SIGINT', shutdown('SIGINT'))
.on('uncaughtException', shutdown('uncaughtException')); 

module.exports = shutdown