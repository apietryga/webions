const serv = {
  init(){
    (window.location.protocol == "https:")?this.protocol = "wss:":this.protocol = "ws:";
    // this.ws = new WebSocket(this.protocol+"//"+window.location.host+"/fetch/?name="+urlParams.get('player'),'echo-protocol');
    this.ws = new WebSocket(this.protocol+"//"+window.location.host+"/fetch/?name="+player.name,'echo-protocol');
    this.ws.onopen = () => {this.connected = true;console.log("WS open.");}
    this.param.focus = true;
    window.onfocus = () => {this.param.focus = true;};
    window.onblur  = () => {this.param.focus = false;};

  },
  connected:false,
  param : {},
  // data to server
  paramUpdate(){
    this.param.name = player.name;
    controls.planeClicking.followRoute();
    this.param.controls = controls.vals;
    if(player.setRedTarget){this.param.target = player.setRedTarget;delete player.setRedTarget}
    if(player.itemAction){this.param.itemAction = player.itemAction;delete player.itemAction}
    if(player.says){this.param.says = player.says;}
    if(isSet(controls.outfit)){this.param.outfit = controls.outfit; delete controls.outfit;}
    return this.param;
  },
  // every frame load:
  load(cb){
    // Response from serv
    const res = (msg,callback) => {
      const data = JSON.parse(msg.data);
      // update game properties
      this.datetime = data.game.time;
      this.time = new Date(this.datetime).getTime();
      gamePlane.fps = data.game.fps;
      // clear sayin'


      // player died
      if(typeof data.game.dead != "undefined"){
        gamePlane.stop("You are dead.");
        callback();
      }
      // get names of online players
      let onlinePlayers = [];
      for(const p of data.creatures){
        if(p.type == "player"){
          onlinePlayers.push(p.name);
        }
      }
      // kick off offline players and update creature names
      for(const ac of gamePlane.creatures.list){
        if(!onlinePlayers.includes(ac.name) && ac.type == "enemy"){
          gamePlane.actions.push(new Action("misc",ac.position[0]+ac.x,ac.position[1]+ac.y,40,40,0));     
          gamePlane.creatures.list.splice(gamePlane.creatures.list.indexOf(ac),1);
          if(gamePlane.creatures.ids.includes(ac.id)){
            gamePlane.creatures.ids.splice(gamePlane.creatures.ids.indexOf(ac.id),1);
          }
          continue;
        }
        if(!gamePlane.creatures.ids.includes(ac.id)){
          gamePlane.creatures.ids.push(ac.id);
        }
      }
      // updating creatures values
      for(const creature of data.creatures){
        let myChar;
        let charId;
        if(!gamePlane.creatures.ids.includes(creature.id)){
          if(creature.name == player.name){
            player = new Creature("player",player.position,player.name); 
            myChar = player;
          }else{
            let type = "monster";
            if(creature.type == "player"){type = "enemy";}
            if(creature.type == "npc"){type = "npc";}
            // }else if(creature.type == "npc"){type = "npc"}
            myChar = new Creature(type,creature.position,creature.name);
          }
          gamePlane.creatures.list.push(myChar);
          charId = gamePlane.creatures.list.length-1;
        }else{
          // find it in gamePlane.creatures.list
          for(const [i,pl] of gamePlane.creatures.list.entries()){
            if(pl.id == creature.id){
              myChar = creature;
              charId = i;
            }
          }
          // update console
          if(creature.name == player.name && creature.text != "" && isSet(creature.text)){
            inGameConsole.text = creature.text;
          }
        }
        // updating values
        for(const key of Object.keys(creature)){
          if(key == "position"){
            // gamePlane.creatures.list[charId]["servPos"] = creature[key];
            if(!compareTables(gamePlane.creatures.list[charId]["newPos"],creature[key])){
              gamePlane.creatures.list[charId]["oldPos"] = gamePlane.creatures.list[charId]["newPos"];
              gamePlane.creatures.list[charId]["newPos"] = creature[key];
              gamePlane.creatures.list[charId]["walkingStart"] = serv.time;
            }
            continue;
          }
          if(key == "health"){gamePlane.creatures.list[charId]["oldHealth"] = gamePlane.creatures.list[charId]["health"];}
          if(key == "mana"){gamePlane.creatures.list[charId]["oldMana"] = gamePlane.creatures.list[charId]["mana"];}
          if(key == "skills"){
            let oldExp;
            let oldLvl;
            if(gamePlane.creatures.list[charId].type == "player"
            && isSet(gamePlane.creatures.list[charId].skills)){
              if(gamePlane.creatures.list[charId].skills["exp"] != creature[key]["exp"]){
                oldExp = gamePlane.creatures.list[charId].skills["exp"];
              }
              if(gamePlane.creatures.list[charId].skills["level"] != creature[key]["level"]){
                oldLvl = gamePlane.creatures.list[charId].skills["level"];                  
              }
            }
            gamePlane.creatures.list[charId].skills = {};
            for(const k of Object.keys(creature[key])){
              if(k == "exp" && isSet(oldExp)){
                gamePlane.creatures.list[charId].skills["oldExp"] = oldExp;
              }
              if(k == "level" && isSet(oldLvl)){
                gamePlane.creatures.list[charId].skills["oldLvl"] = oldLvl;
              }
              gamePlane.creatures.list[charId].skills[k] = creature[key][k];
            }
            if(!isSet(oldExp)){gamePlane.creatures.list[charId].skills["oldExp"] = gamePlane.creatures.list[charId].skills["exp"];}
            if(!isSet(oldLvl)){gamePlane.creatures.list[charId].skills["oldLvl"] = gamePlane.creatures.list[charId].skills["level"];}
            continue;
          }
          if(key == "type"){continue;}
          if(key == "console"){menus.console.log(creature[key])}
          gamePlane.creatures.list[charId][key] = creature[key];
        }
      }
      // update items
      gamePlane.items = [];
      for(const item of data.items){
        gamePlane.items.push(new Item(item));
      }
      // update dev info
      // if(game.dev){
        // dev.stats = data.game;
        dev.stats.fps = dev.counterFPS+"/"+data.game.fps;
        dev.stats.time = serv.time;
        dev.stats.db = data.game.db;
        dev.stats.player = player.name;
        // dev.stats.health = player.health;
        dev.stats.position = player.position;
        dev.stats.grids = map.grids.length;
        // dev.stats.url = urlParams.get('player');
        dev.stats.ping = this.time - player.lastFrame;
        dev.stats.cpu = data.game.cpu;
        dev.stats.redTarget = player.redTarget;
        // dev.stats.ws = JSON.stringify(gamePlane.creatures.list);
        dev.update();
      // }
      callback();
    }
    this.ws.onclose = () => {             // set connection
      this.connected = false;console.log("WS closed.");
      let newURL = window.location.origin+"/offline.html?reason=servErr&back=";
      newURL += encodeURIComponent(window.location.href);
      window.location.replace(newURL);
    }
    if(this.connected){
      // send to server
      this.ws.send(JSON.stringify(this.paramUpdate()));
      // release clicked 
      controls.falseQueneCall();
      if(isSet(this.param.itemAction)){delete this.param.itemAction;}
      if(isSet(this.param.says)){delete this.param.says;}
      if(isSet(this.param.outfit)){delete this.param.outfit;}
      if(isSet(this.param.target)){delete this.param.target;}
      this.ws.onmessage = (msg) => {res(msg,()=>{cb();})};     
    }else{
      cb();
    }
    this.ws.onerror = (error) => {         // connection error
      gamePlane.stop();
      // console.log("Your connection is lost, ");
      console.log(error);
    }
  }
}
serv.init();
