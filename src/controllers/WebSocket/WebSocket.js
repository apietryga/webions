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
Object.defineProperty(exports, "__esModule", { value: true });
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
    sendDataToClient(player, data) {
        console.log({ player, data, wss });
        data.game.cpu = Math.round((100 * (os.totalmem() - os.freemem())) / os.totalmem) + "%";
        data = stringify(data, null, 2);
        const connection = wss.connections.find((ws) => ws.name == player.name);
        if (!connection) {
            return console.log("ERROR - no connection for ", player.name, { wss });
        }
        connection.sendUTF(data);
    }
}
let wss;
// module.exports = async (server:any) => {
exports.default = (server) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new WsController();
    return yield new Promise((res, rej) => {
        wss = new WebSocketServer({ httpServer: server });
        wss.on('request', (req, test) => {
            const connection = req.accept('echo-protocol', req.origin);
            connection.name = req.resourceURL.query.name;
            connection.on('message', (data) => __awaiter(void 0, void 0, void 0, function* () {
                data = JSON.parse(data.utf8Data);
                controller.getDataFromClient(Object.assign(Object.assign({}, data), { name: req.resourceURL.query.name }));
            }));
            connection.on('close', () => {
                controller.getDataFromClient({
                    name: req.resourceURL.query.name,
                    logout: true
                });
            });
            connection.on('error', (error) => {
                console.log('error:', error);
            });
            res(controller);
        });
    });
});
//# sourceMappingURL=WebSocket.js.map