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
		this.requestsQueue = []
	}

	async getDataFromClient(data){
		console.log(data)
		// const param = JSON.parse(data.utf8Data);
		this.requestsQueue.push(data)

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
	}

	sendDataToClient(data){
		data = stringify({
			...data,
			game: {
				...game,
				time: new Date().getTime(),
				cpu: Math.round((100*(os.totalmem() - os.freemem()))/os.totalmem)+"%",
			},
		}, null, 2)
		this.connection.sendUTF(data)
	}

}

module.exports = async (server, cm, im, dbconnect) => {
  const controller = new WsController( cm, im, dbconnect )
	return await new Promise((res, rej) => {
		new WebSocketServer({httpServer : server})
		.on('request', req => {
			controller.connection = req.accept('echo-protocol', req.origin)
			controller.connection.on('message', async data => { 
				data = JSON.parse(data.utf8Data)
				controller.getDataFromClient(data) 
			})
			res(controller)
		})
		// setTimeout(() => { res('Server not responing') }, 5000);
	})
}