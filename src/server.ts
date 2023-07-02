// import dbConnect from "./database/dbconnect";
import dbc from "./database/dbconnect";
// const dbc = dbConnect();
import Game from './controllers/Game/Game';

import router from "./router";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
// const express = require('express')
import express from 'express';
import cors from 'cors';
const app = express()
app.use(cors())
// require('./controllers/crashController')
require('./controllers/njkController').configure(app)
require('dotenv').config()
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('./public'));
app.use('/game/get-map', express.static('./src/map/'));

app.use(cookieParser());

declare global {
  var dbconnected: any;
  // var cm: any;
}
( async () => {
  // cm.init();
  // global.cm = cm;
  // im.init();
  global.dbconnected = dbc[ 'json' ]
  // global.dbconnected = 'json'

  // cm.players.init(global.dbconnected)

  router.set({ app })
  router.set({ dbconnect: global.dbconnected })
  // router.set({ players: cm.players })
  app.use(router.call)

	const server = app.listen(process.env.PORT || 2095)
	new Game(server)
  
  console.log("Server running\nhttp://localhost:" + 2095);
	
})()