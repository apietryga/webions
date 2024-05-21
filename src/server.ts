import dbc from "./database/dbconnect";
import Game from './controllers/Game/Game';
import router from "./router";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";
import express from 'express';
import cors from 'cors';

const port = process.env.PORT || 2095
const app = express()

require('./controllers/njkController').configure(app)
require('dotenv').config()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use('/game/get-map', express.static('./src/map/'));
app.use(cookieParser());
app.use(router.call)

declare global { var dbconnected: any; }

global.dbconnected = dbc[ 'json' ]

router.set({ app })
router.set({ dbconnect: global.dbconnected })

const server = app.listen(port)
new Game(server)

console.log("Server running\nhttp://localhost:" + port);
