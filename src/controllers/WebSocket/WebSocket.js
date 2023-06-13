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
const os = require("os");
const stringify = require("json-stringify-pretty-compact");
const WebSocketServer = require("websocket").server;
const wm = require('../wallsController');
const game = require("../../../public/js/gameDetails");
class WsController {
    constructor() {
        this.connection = null;
        this.clientsRequestsQueue = [];
    }
    getDataFromClient(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.clientsRequestsQueue.push(data);
        });
    }
    sendDataToClient(data) {
        data = stringify(Object.assign(Object.assign({}, data), { game: Object.assign(Object.assign({}, data.game), { cpu: Math.round((100 * (os.totalmem() - os.freemem())) / os.totalmem) + "%" }) }), null, 2);
        this.connection.sendUTF(data);
    }
}
module.exports = (server) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new WsController();
    return yield new Promise((res, rej) => {
        new WebSocketServer({ httpServer: server })
            .on('request', (req) => {
            controller.connection = req.accept('echo-protocol', req.origin);
            controller.connection.on('message', (data) => __awaiter(void 0, void 0, void 0, function* () {
                data = JSON.parse(data.utf8Data);
                controller.getDataFromClient(data);
            }));
            res(controller);
        });
    });
});
