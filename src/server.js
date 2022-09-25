const wsController = require('./controllers/wsController')
const game = require("../public/js/gameDetails");
const dbConnect = require("./database/dbconnect");
const dbc = new dbConnect();
const cm = require('./controllers/creaturesController')
const im = require('./controllers/itemsController')
const router = require("./router")
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
require('./controllers/crashController') // save players before serv crash
require('./controllers/njkController').configure(app)
require('dotenv').config()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));

( async () => {
  cm.init();
  im.init();
  await dbc.init()
  global.dbconnected = dbc[game.db]

  cm.players.init(dbc[game.db])

  router.set({ app })
  router.set({ dbconnect: dbc[game.db] })
  router.set({ players: cm.players })
  app.use(router.call)

  const server = app.listen(process.env.PORT || 5000)
  wsController( server , cm, im, dbc[game.db])
  game.startServerTime = new Date().getTime();
  console.log("SERWER IS RUNNING");
})()