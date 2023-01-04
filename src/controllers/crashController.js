// ! Cant run global vars from here, so make it again
const dbConnect = require('../database/dbconnect')
const dbc = new dbConnect();
const cm = require('./creaturesController')
const logger = require('../config/winston')

// CATCH ALL CONSOLE LOGS AND ERRORS
// const log = console.log;
// const err = console.error;
// const extendConsole = val => {
//   const date = new Date();
//   const time = date.getHours()+":"+date.getMinutes(); 
//   args = [time,val];
//     logger.log(`[${time}]: ${val}`)
// }
// console.log = val => {     
//   extendConsole(val);
//   log.apply(console, args);
// }
// console.error = val => {     
//   extendConsole(val);
//   err.apply(console, args);
// }



// SAVE PLAYERS BEFORE SERVER CRASH
const shutdown = signal => {
  return async err => {
    logger.error('[' + signal + ']: ' + ( err?.stack ? err?.stack : err?.message ))
    // console.error({ title: "CRASH CONTROLLER", err })
    if(err.message === 'Socket closed unexpectedly'){
      // redis shut down, so set db again
      global.dbconnected = dbc[await dbc.init()]
    }
    for(const player of cm.players.list){
      player.console = "Server will restart in few seconds.";
      global.dbconnected.update(player);
    }
    // console.log('PLAYERS SAVED AFTER '+signal);
  };
}

process.on('SIGTERM', shutdown('SIGTERM'))
.on('SIGINT', shutdown('SIGINT'))
.on('uncaughtException', shutdown('uncaughtException')); 

module.exports = shutdown