const os = require("os");
const stringify = require("json-stringify-pretty-compact");
const WebSocketServer = require("websocket").server;
const wm = require('../wallsController')
const game = require("../../../public/js/gameDetails");

class WsController {

	// private cm:any 
	// private im:any 
	public connection:any 
	// private cmdbconnect:any 
	private clientsRequestsQueue:any 

	constructor(){
	// constructor(cm:any , im: any ){
		// this.cm = cm
		// this.im = im
		this.connection = null
		// this.dbconnect = dbconnect
		this.clientsRequestsQueue = []
	}

	public async getDataFromClient(data: any): Promise<void> {

		console.log({ data })
		// const param = JSON.parse(data.utf8Data);
		this.clientsRequestsQueue.push(data)

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

	sendDataToClient(data:any){
		data = stringify({
			...data,
			game: {
				...data.game,
				// time: new Date().getTime(),
				cpu: Math.round((100*(os.totalmem() - os.freemem()))/os.totalmem)+"%",
			},
		}, null, 2)
		this.connection.sendUTF(data)
	}

}

module.exports = async (server:any) => {
// module.exports = async (server:any, cm:any, im:any) => {
  // const controller = new WsController( cm, im  )
  const controller = new WsController()
	return await new Promise((res, rej) => {
		new WebSocketServer({httpServer : server})
		.on('request', (req: { accept: (arg0: string, arg1: any) => any; origin: any; }) => {
			controller.connection = req.accept('echo-protocol', req.origin)
			controller.connection.on('message', async (data: { utf8Data: string; }) => { 
				data = JSON.parse(data.utf8Data)
				// console.log("MESSAGE", data)
				controller.getDataFromClient(data) 
			})
			res(controller)
		})
		// setTimeout(() => { res('Server not responing') }, 5000);
	})
}