const wsController = require('./controllers/wsController')
const game = require("../public/js/gameDetails");
const dbConnect = require("./database/dbconnect");
const dbc = new dbConnect();
const cm = require('./controllers/creaturesController')
const im = require('./controllers/itemsController')
const Game = require('./controllers/Game/Game')

const router = require("./router")
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
require('./controllers/crashController')
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
  const wsServer = await wsController( server , cm, im, global.dbconnected)

	new Game(wsServer)

	game.startServerTime = new Date().getTime();
  console.log("Development server \nhttp://localhost:" + 2095);
})()