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
        // constructor(cm:any , im: any ){
        // this.cm = cm
        // this.im = im
        this.connection = null;
        // this.dbconnect = dbconnect
        this.clientsRequestsQueue = [];
    }
    getDataFromClient(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log({ data });
            // const param = JSON.parse(data.utf8Data);
            this.clientsRequestsQueue.push(data);
            // console.log({ data })
            // In game actions
            // if(Object.keys(data).includes("name")){
            // 	game.time = new Date();
            // 	game.cpu = Math.round((100*(os.totalmem() - os.freemem()))/os.totalmem)+"%";
            // 	let [ output, player ] = await cm.update(data, this.dbconnect)
            // 	console.log({ player })
            // 	output = this.im.update(output, player)
            // 	// this.im.update(output,player,(output)=>{
            // 		// wm.update(output, (output)=>{
            // 	output = wm.update(output)
            // 			// this.connection.sendUTF(stringify(output,null,2));
            // 	// this.sendDataToClient(output)
            // 		// })
            // 	// })
            // }
        });
    }
    sendDataToClient(data) {
        data = stringify(Object.assign(Object.assign({}, data), { game: Object.assign(Object.assign({}, data.game), { 
                // time: new Date().getTime(),
                cpu: Math.round((100 * (os.totalmem() - os.freemem())) / os.totalmem) + "%" }) }), null, 2);
        this.connection.sendUTF(data);
    }
}
module.exports = (server) => __awaiter(void 0, void 0, void 0, function* () {
    // module.exports = async (server:any, cm:any, im:any) => {
    // const controller = new WsController( cm, im  )
    const controller = new WsController();
    return yield new Promise((res, rej) => {
        new WebSocketServer({ httpServer: server })
            .on('request', (req) => {
            controller.connection = req.accept('echo-protocol', req.origin);
            controller.connection.on('message', (data) => __awaiter(void 0, void 0, void 0, function* () {
                data = JSON.parse(data.utf8Data);
                // console.log("MESSAGE", data)
                controller.getDataFromClient(data);
            }));
            res(controller);
        });
        // setTimeout(() => { res('Server not responing') }, 5000);
    });
});
