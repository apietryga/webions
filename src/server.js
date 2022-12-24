const wsController = require('./controllers/wsController')
const game = require("../public/js/gameDetails");
const dbConnect = require("./database/dbconnect");
const dbc = new dbConnect();
const cm = require('./controllers/creaturesController')
const im = require('./controllers/itemsController')
const router = require("./router")
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const express = require('express')
const app = express()
require('./controllers/crashController') // save players before serv crash
require('./controllers/njkController').configure(app)
require('dotenv').config()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(cookieParser());

( async () => {
  cm.init();
  global.cm = cm;
  im.init();
  global.dbconnected = dbc[ await dbc.init() ]

  cm.players.init(global.dbconnected)

  router.set({ app })
  router.set({ dbconnect: global.dbconnected })
  router.set({ players: cm.players })
  app.use(router.call)

  const server = app.listen(process.env.PORT || 2095)
  wsController( server , cm, im, global.dbconnected)
  game.startServerTime = new Date().getTime();
  console.log("SERWER IS RUNNING ON PORT " + 2095);
})()