const os = require("os");
const stringify = require("json-stringify-pretty-compact");
const WebSocketServer = require("websocket").server;
const wm = require('../wallsController')
const game = require("../../../public/js/gameDetails");

class WsController {

	public connection:any 
	private clientsRequestsQueue:any // get rid of this
	// public requests: Array<Object>
	public requests: Map<string, Array<Object>>

	constructor(){
		this.connection = null
		this.clientsRequestsQueue = []
		this.requests = new Map()
	}

	public async getDataFromClient(data: any, token: string | null = null): Promise<void> {

		this.clientsRequestsQueue.push(data)

		if(typeof token !== 'string'){
			return
		}

		const single_request = this.requests.get(token)
		// const single_request = this.requests.has(token)
		// console.log({ single_request, token, requests: this.requests })
		// if(this.requests.has(token)){
		// if(typeof this.requests.get(token) !== 'undefined'){
		if(typeof single_request !== 'undefined'){
			// data = [...single_request, data]
			this.requests.set(token, [...single_request, data])
			return 
		}

		this.requests.set(token, [data])
		return 
		

	}

	sendDataToClient(player:any, data:any){
		data.game.cpu = Math.round((100*(os.totalmem() - os.freemem()))/os.totalmem)+"%"
		data = stringify(data, null, 2)
		const connection = wss.connections.find((ws: any) => ws.name == player.name)
		if(!connection){
			return console.log("ERROR - no connection for ", player.name, { wss })
		}
		connection.sendUTF(data)
	}

}

let wss:any;

// module.exports = async (server:any) => {
export default async (server:any) => {
  	const controller = new WsController()
	return await new Promise((res, rej) => {
		wss = new WebSocketServer({ httpServer : server })
		wss.on('request', (req: any) => {

			const connection = req.accept('echo-protocol', req.origin)
			connection.name = req.resourceURL.query.name

			connection.on('message', async (data: { utf8Data: string; }) => {

				data = JSON.parse(data.utf8Data)
				const token = req.cookies.find((item: any) => item.name == 'token')?.value

				controller.getDataFromClient({
					...data, 
					name: req.resourceURL.query.name, 
				}, token)

			})

			connection.on('close', () => {
				controller.getDataFromClient({ 
					name: req.resourceURL.query.name, 
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