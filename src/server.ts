const dbConnect = require("./database/dbconnect");
const dbc = new dbConnect();
const cm = require('./controllers/creaturesController')
const im = require('./controllers/itemsController')
const Game = require('./controllers/Game/Game')
const router = require("./router")
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
// const express = require('express')
import express from 'express';
const cors = require('cors')
const app = express()
app.use(cors())
require('./controllers/crashController')
require('./controllers/njkController').configure(app)
require('dotenv').config()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(cookieParser());

declare global {
  var dbconnected: any;
  var cm: any;
}
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
  
  console.log("Development server \nhttp://localhost:" + 2095);
	new Game(server)
	
})()