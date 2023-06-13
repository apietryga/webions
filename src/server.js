"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const WebSocket = require('ws');
const dbConnect = require("./database/dbconnect");
const dbc = new dbConnect();
const cm = require('./controllers/creaturesController');
const im = require('./controllers/itemsController');
const Game = require('./controllers/Game/Game');
const router = require("./router");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
// const express = require('express')
const express_1 = __importDefault(require("express"));
const cors = require('cors');
const app = (0, express_1.default)();
app.use(cors());
require('./controllers/crashController');
require('./controllers/njkController').configure(app);
require('dotenv').config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express_1.default.static('./public'));
app.use(cookieParser());
(() => __awaiter(void 0, void 0, void 0, function* () {
    cm.init();
    global.cm = cm;
    im.init();
    global.dbconnected = dbc[yield dbc.init()];
    cm.players.init(global.dbconnected);
    router.set({ app });
    router.set({ dbconnect: global.dbconnected });
    router.set({ players: cm.players });
    app.use(router.call);
    const server = app.listen(process.env.PORT || 2095);
    // game.startServerTime = new Date().getTime();
    console.log("Development server \nhttp://localhost:" + 2095);
    // console.log({ wsServer })
    new Game(server);
    // const server = app.listen()
    // const port = 3001
    // server.listen( port, () => {
    // 		// console.log(`Server started on port ${server.address().port} :)`);
    // 		console.log("Server run on \nhttp://localhost:" + port);
    // });
    // game.startServerTime = new Date().getTime();
}))();
