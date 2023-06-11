const os = require("os");
const stringify = require("json-stringify-pretty-compact");
const WebSocketServer = require("websocket").server;
const wm = require('../controllers/wallsController')
const game = require("../../public/js/gameDetails");

class WsController {

	constructor(cm, im, dbconnect){
		this.cm = cm
		this.im = im
		this.connection = null
		this.dbconnect = dbconnect
	}

	async getDataFromClient(data){
		const param = JSON.parse(data.utf8Data);
		console.log({ param })
		// In game actions
		if(Object.keys(param).includes("name")){
			game.time = new Date();
			game.cpu = Math.round((100*(os.totalmem() - os.freemem()))/os.totalmem)+"%";
			let [ output, player ] = await cm.update(param, this.dbconnect)
			this.im.update(output,player,(output)=>{
				wm.update(output, (output)=>{
					this.connection.sendUTF(stringify(output,null,2));
				})
			})
		}
	}

}

module.exports = (server, cm, im, dbconnect) => {
  const controller = new WsController( cm, im, dbconnect )
	new WebSocketServer({httpServer : server}).on('request', req => {
		controller.connection = req.accept('echo-protocol', req.origin)
    controller.connection.on('message', async data => { controller.getDataFromClient(data) })
  })
}