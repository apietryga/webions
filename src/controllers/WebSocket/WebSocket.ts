const os = require("os");
const stringify = require("json-stringify-pretty-compact");
const WebSocketServer = require("websocket").server;
const wm = require('../wallsController')
const game = require("../../../public/js/gameDetails");

class WsController {

	public connection:any 
	private clientsRequestsQueue:any 

	constructor(){
		this.connection = null
		this.clientsRequestsQueue = []
	}

	public async getDataFromClient(data: any): Promise<void> {
		this.clientsRequestsQueue.push(data)
	}

	sendDataToClient(data:any){
		data = stringify({
			...data,
			game: {
				...data.game,
				cpu: Math.round((100*(os.totalmem() - os.freemem()))/os.totalmem)+"%",
			},
		}, null, 2)
		this.connection.sendUTF(data)
	}

}

module.exports = async (server:any) => {
  const controller = new WsController()
	return await new Promise((res, rej) => {
		new WebSocketServer({httpServer : server})
		.on('request', (req: { accept: (arg0: string, arg1: any) => any; origin: any; }) => {
			controller.connection = req.accept('echo-protocol', req.origin)
			controller.connection.on('message', async (data: { utf8Data: string; }) => { 
				data = JSON.parse(data.utf8Data)
				controller.getDataFromClient(data) 
			})
			res(controller)
		})
	})
}