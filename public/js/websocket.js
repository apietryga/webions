class ServerConnect extends WebSocket {

	constructor() {
		const protocol = window.location.protocol == "https:" ? "wss:" : "ws:";
		// const uri = protocol + "//" + window.location.host + "/fetch/?name=" + player.name
		const uri = protocol + "//" + window.location.host + "/fetch/?name=" + player.name
		super(uri, 'echo-protocol')

		this.onopen = this.onOpen
		this.onmessage = this.getDataFromServer

		this.param = { focus: true }
    // window.onfocus = () => {this.param.focus = true;};
    // window.onblur  = () => {this.param.focus = false;};
		// this.paramsSent = false
		this.connected = false
		this.lastSentParams = ""
		this.message = {}
	}

	onOpen(){
		this.connected = true;
		console.log("WS open.")
	}
	
	onclose(e) {
		console.log('closin')
		// set connection
		if(e != null){console.error(e)}
		this.connected = false;console.log("WS closed.");
		let newURL = window.location.origin+"/offline.html?reason=servErr&back=";
		newURL += encodeURIComponent(window.location.href);
		window.location.replace(newURL)
		return
	}
	
	onerror(error) {
		console.log({ error })
		return gamePlane.stop()
	}
	
	async getDataFromServer(msg){
		const data = JSON.parse(msg.data);
		this.message = data


		// update game properties
		this.datetime = data.game.time;
		this.time = new Date(this.datetime).getTime();
		gamePlane.fps = data.game.fps

		// console.log(' game', data.game)
		// gamePlane = {...data.game}


		// console.log({ data })

		// return

			// magic walls
			gamePlane.mwalls = [];
			// for(const mwall of data.walls){
			// 	gamePlane.mwalls.push(new Grid([0,mwall[0]*1,mwall[1]*1,mwall[2]*1,'mwalls']));
			// }

			// player died
			// if(typeof data.game.dead != "undefined"){
			// 	gamePlane.stop("You are dead.");
			// 	// callback();
			// 	return
			// }

			// get names of online players
			// let onlinePlayers = [];
			// for(const p of data.creatures){
			// 	if(p.type == "player"){
			// 		onlinePlayers.push(p.name);
			// 	}
			// }

			// kick off offline players and update creature names
			// for(const ac of gamePlane.creatures.list){
			// 	if(!onlinePlayers.includes(ac.name) && ac.type == "enemy"){
			// 		gamePlane.actions.push(new Action("misc",ac.position[0]+ac.x,ac.position[1]+ac.y,40,40,0));     
			// 		gamePlane.creatures.list.splice(gamePlane.creatures.list.indexOf(ac),1);
			// 		if(gamePlane.creatures.ids.includes(ac.id)){
			// 			gamePlane.creatures.ids.splice(gamePlane.creatures.ids.indexOf(ac.id),1);
			// 		}
			// 		continue;
			// 	}
			// 	if(!gamePlane.creatures.ids.includes(ac.id)){
			// 		gamePlane.creatures.ids.push(ac.id);
			// 	}
			// }

			// update items
			// gamePlane.items = [];
			// for(const item of data.items){
			// 	gamePlane.items.push(new Item(item));
			// }

			// updating creatures values
			for(const dataCreature of data.creatures){
				// dataCreature
				let creature = gamePlane.creatures.list.filter(cr => cr.id === dataCreature.id)?.[0]

				if(!creature){
					// creature = dataCreature
					const {type, position, name, id} = dataCreature
					creature = new Creature(type, position, name, id)
					gamePlane.creatures.list.push(creature)
					continue
				}

				// console.log(creature.serverUpdate)

				for(const property in dataCreature){
					creature[property] = dataCreature[property]
				}
				
				if(creature.name === player.name){
					player = creature
				}
				// creature


				
				// const creature = data.creatures[property]
				// gamePlane.creatures
			}

			// for(const creature of data.creatures){
			// 	let myChar;
			// 	let charId;
			// 	if(!gamePlane.creatures.ids.includes(creature.id)){
			// 		if(creature.name == player.name){
			// 			player = new Creature("player",player.position,player.name); 
			// 			myChar = player;
			// 		}else{
			// 			let type = "monster";
			// 			if(creature.type == "player"){type = "enemy";}
			// 			if(creature.type == "npc"){type = "npc";}
			// 			// }else if(creature.type == "npc"){type = "npc"}
			// 			myChar = new Creature(type,creature.position,creature.name);
			// 		}
			// 		myChar.id = creature.id;
			// 		// prevent double chars/players
			// 		let isPlayer = false;
			// 		let isSet = false;
			// 		for(const cr of gamePlane.creatures.list){
			// 			if(myChar.id == cr.id){
			// 				isSet = true;
			// 			}
			// 			if(cr.type == "player" && myChar.type == "player"){
			// 				isPlayer = true;              
			// 			}
			// 		}

			// 		if( !isPlayer && !isSet){
			// 			gamePlane.creatures.list.push(myChar);
			// 		}
			// 		charId = gamePlane.creatures.list.length-1;
			// 	}else{
			// 		// find it in gamePlane.creatures.list
			// 		for(const [i,pl] of gamePlane.creatures.list.entries()){
			// 			if(pl.id == creature.id){
			// 				myChar = creature;
			// 				charId = i;
			// 			}
			// 		}
			// 		// update ingameconsole
			// 		if(creature.name == player.name && creature.text != "" && isSet(creature.text)){
			// 			inGameConsole.text = creature.text;
			// 			if(creature.text == "Target lost."){
			// 				controls.currentTarget = -1;
			// 			}
			// 			if(creature.text == "There's no way."){
			// 				joyPad.vibrate(0.1,10);
			// 			}
			// 		}
			// 	}

			// 	// updating values
			// 	for(const key of Object.keys(creature)){
			// 		// console.log(creature)
			// 		if(key == "serverUpdating"){
			// 			gamePlane.creatures.list[charId]["serverUpdating"] = creature[key];
			// 		}
			// 		if(key == "position"){
			// 			// gamePlane.creatures.list[charId]["servPos"] = creature[key];
			// 			if(!compareTables(gamePlane.creatures.list[charId]["newPos"],creature[key])){
			// 				gamePlane.creatures.list[charId]["oldPos"] = gamePlane.creatures.list[charId]["newPos"];
			// 				gamePlane.creatures.list[charId]["newPos"] = creature[key];
			// 				gamePlane.creatures.list[charId]["walkingStart"] = serv.time;
			// 			}
			// 			continue;
			// 		}
			// 		if(key == "health"){gamePlane.creatures.list[charId]["oldHealth"] = gamePlane.creatures.list[charId]["health"];}
			// 		if(key == "mana"){gamePlane.creatures.list[charId]["oldMana"] = gamePlane.creatures.list[charId]["mana"];}
			// 		if(key == "skills"){
			// 			let oldExp;
			// 			let oldLvl;
			// 			if(gamePlane.creatures.list[charId].type == "player"
			// 			&& isSet(gamePlane.creatures.list[charId].skills)){
			// 				if(gamePlane.creatures.list[charId].skills["exp"] != creature[key]["exp"]){
			// 					oldExp = gamePlane.creatures.list[charId].skills["exp"];
			// 				}
			// 				if(gamePlane.creatures.list[charId].skills["level"] != creature[key]["level"]){
			// 					oldLvl = gamePlane.creatures.list[charId].skills["level"];                  
			// 				}
			// 			}
			// 			gamePlane.creatures.list[charId].skills = {};
			// 			for(const k of Object.keys(creature[key])){
			// 				if(k == "exp" && isSet(oldExp)){
			// 					gamePlane.creatures.list[charId].skills["oldExp"] = oldExp;
			// 				}
			// 				if(k == "level" && isSet(oldLvl)){
			// 					gamePlane.creatures.list[charId].skills["oldLvl"] = oldLvl;
			// 				}
			// 				gamePlane.creatures.list[charId].skills[k] = creature[key][k];
			// 			}
			// 			if(!isSet(oldExp)){gamePlane.creatures.list[charId].skills["oldExp"] = gamePlane.creatures.list[charId].skills["exp"];}
			// 			if(!isSet(oldLvl)){gamePlane.creatures.list[charId].skills["oldLvl"] = gamePlane.creatures.list[charId].skills["level"];}
			// 			continue;
			// 		}
			// 		if(key == "type"){continue;}
			// 		if(key == "console"){menus.console.log(creature[key])}
			// 		gamePlane.creatures.list[charId][key] = creature[key];
			// 	}
			// }

			// update dev info
			dev.stats.fps = dev.counterFPS+"/"+data.game.fps;
			dev.stats.time = serv.time;
			dev.stats.db = data.game.db;
			dev.stats.player = player.name;
			dev.stats.position = player.position;
			dev.stats.grids = map.grids.length;
			dev.stats.ping = this.time - player.lastFrame;
			dev.stats.cpu = data.game.cpu;
			dev.stats.redTarget = player.redTarget;
			dev.update();
		
	}

	async sendDataToServer(){
		this.paramUpdate()
		if(!Object.keys(this.clientUpdate).length){ return }

		this.send(JSON.stringify(this.clientUpdate));
		this.clearParams()
	}

	paramUpdate(){
		controls.falseQueneCall();
		this.clientUpdate = {}
		player.serverUpdate = {}
    controls.planeClicking.followRoute();
    this.param.controls = controls.vals;

		if(controls.vals.length && !player.processing?.walk){
			this.clientUpdate.controls = controls.vals
		}

		if(this.param.focus != this.lastSentParams.focus){
			this.clientUpdate.focus = this.param.focus
		}

    if(player.setRedTarget){this.param.target = player.setRedTarget;delete player.setRedTarget}
    if(player.itemAction){this.param.itemAction = player.itemAction;delete player.itemAction}
    if(isSet(player.sayToServ) && player.sayToServ){this.param.says = player.sayToServ;delete player.sayToServ;}
    if(isSet(controls.outfit)){this.param.outfit = controls.outfit; delete controls.outfit;}
    if(isSet(player.mwallDrop) && player.mwallDrop){this.param.mwallDrop = player.mwallDrop;delete player.mwallDrop;}
		// const newParams = JSON.stringify(this.param)
		// const newParams = this.param
		// if(this.lastSentParams === this.param){ 
		// 	// return false
		// 	this.clientUpdate = {}
		// }
		// this.lastSentParams = newParams
		this.lastSentParams = {...this.param}
    // return newParams
  }

	clearParams(){
		if(!this.connected){ return }
		const releaseKeys = [
			'itemAction',
			'says',
			'outfit',
			'target',
			'autoShot',
			'mwallDrop',
			'autoMWDrop'
		]
		for(const key of releaseKeys){
			if(isSet(this.param[key])){delete this.param[key];}
		}
	}

}

