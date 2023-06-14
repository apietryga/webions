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

	sendDataToClient(player:any, data:any){
		data.game.cpu = Math.round((100*(os.totalmem() - os.freemem()))/os.totalmem)+"%"
		data = stringify(data, null, 2)
		const connection = wss.connections.find((ws: any) => ws.name == player.name)
		console.log({ connection, wss })
		connection.sendUTF(data)
	}

}

let wss:any;

module.exports = async (server:any) => {
  const controller = new WsController()
	return await new Promise((res, rej) => {
		wss = new WebSocketServer({ httpServer : server })
		wss.on('request', (req: any, test:any) => {

			const connection = req.accept('echo-protocol', req.origin)
			connection.name = req.resourceURL.query.name

			connection.on('message', async (data: { utf8Data: string; }) => {
				data = JSON.parse(data.utf8Data)
				controller.getDataFromClient({
					...data, 
					name: req.resourceURL.query.name, 
					key: req.key
				}) 
			})

			connection.on('close', () => {
				controller.getDataFromClient({ 
					name: req.resourceURL.query.name, 
					key: req.key, 
					logout: true 
				}) 
			})

			connection.on('error', (error: any) => { 
				console.log('error:', error)
			})

			res(controller)
		})
	})
}