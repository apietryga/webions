
// SAVE PLAYERS BEFORE SERVER CRASH
const shutdown = signal => {
  return err => {
    if (err) console.error(err.stack || err);
    for(const player of cm.players.list){
      player.console = "Server will restart in few seconds.";
      dbc[game.db].update(player);
    }
    console.log('PLAYERS SAVED AFTER '+signal);
  };
}

process.on('SIGTERM', shutdown('SIGTERM'))
.on('SIGINT', shutdown('SIGINT'))
.on('uncaughtException', shutdown('uncaughtException')); 

module.exports = shutdown