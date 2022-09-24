const wsController = require('./controllers/wsController')

const dbConnect = require("./database/dbconnect");
const dbc = new dbConnect();
const game = require("../public/js/gameDetails");
const cm = require('./controllers/creaturesManagement')
const im = require('./controllers/itemsController')
require('dotenv').config()

const router = require("./router")
// const public = require("./public");
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
const path = require('path')

const nunjucks = require('nunjucks');
// nunjucks.configure('views', {
nunjucks.configure(path.resolve(__dirname, './views/'), {
  express   : app,
  autoescape: true,
  watch : true
})
// app.get(['/','/index.html'], (req, res) => {
//   // res.render("test.html");
//   // nunjucks.render("test.html");
//   // return nunjucks.render(path.resolve(__dirname, '/views/test.html'), articles);
//   // return nunjucks.render(path.resolve(__dirname, './views/test.html'), [1,2,3]);
//   // return nunjucks.render(path.resolve(__dirname, './views/test.html'));
//   // return nunjucks.render(path.resolve(__dirname, './views/index.njk'));
//   // nunjucks.render(path.resolve(__dirname, './views/index.njk'));
//   // res.render(path.resolve(__dirname, './views/test.html'));
//   res.render('template.html', [12,2,1])
// });

cm.init();
im.init();
( async () => {
  await dbc.init()
  cm.players.init(dbc[game.db])

  router.set({ app })
  router.set({ dbconnect: dbc[game.db] })
  router.set({ players: cm.players })
  app.use(router.call)

  const server = app.listen(process.env.PORT || 5000)
  wsController( server , cm, im, dbc[game.db])
  const date = new Date();
  game.startServerTime = date.getTime();
  console.log("SERWER IS RUNNING");
})()

// SAVE PLAYERS BEFORE SERVER CRASH
const shutdown = signal => {
  return (err) => {
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


// CATCH ALL CONSOLE LOGS AND ERRORS
// const log = console.log;
// const err = console.error;
// const extendConsole = (val) => {
//   const date = new Date();
//   const time = date.getHours()+":"+date.getMinutes(); 
//   args = [time,val];
// //   const content = JSON.parse(fs.readFileSync('./public/logs.json','utf-8'));
// //   content.push({"log" : time+": "+val});
// //   fs.writeFileSync('./public/logs.json',stringify(content));
// }
// console.log = (val) => {     
//   extendConsole(val);
//   log.apply(console, args);
// }
// console.error = (val) => {     
//   extendConsole(val);
//   err.apply(console, args);
// }



// HEROKU ANTI IDLING SCRIPT
// const antiIdlingScript = () => {
//   setInterval(() => {
//     http.get(process.env.ORIGIN, (res) => {
//       res.on('data', () => {
//         try {
//           console.log("ANTI IDLING CALL");
//         } catch (err) {
//           console.error("ANTI IDLIG ERROR 1: " + err.message);
//         }
//       });
//     }).on('error', (err) => {
//       // console.error("ANTI IDLIG ERROR 2: " + err.message);
//       console.log("ANTI IDLING SHOT.");
//     });
//   }, 20 * 60 * 1000); // load every 20 minutes
// };antiIdlingScript();