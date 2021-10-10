const serv = {
  init(){
    (window.location.protocol == "https:")?this.protocol = "wss:":this.protocol = "ws:";
    this.ws = new WebSocket(this.protocol+"//"+window.location.host+"/fetch/?name="+urlParams.get('player'),'echo-protocol');
    this.ws.onopen = () => {this.connected = true;console.log("WS open.");}
  },
  connected:false,
  param : {},
  paramUpdate(){
    this.param.name = urlParams.get('player');
    this.param.id = false;
    controls.planeClicking.followRoute();
    this.param.controls = controls.vals;
    isSet(player.redTarget)?this.param.target = player.redTarget:'';
    // console.log(controls.vals);
    return this.param;
  },
  load(){
    // console.log(controls.vals);
    // set connection
    this.ws.onclose = () => {
      this.connected = false;console.log("WS closed.");
      let newURL = window.location.origin+"/offline.html?reason=servErr&back=";
      newURL += encodeURIComponent(window.location.href);
      // console.log(newURL)
      window.location.replace(newURL);
    }
    // send to server
    if(this.connected){
      // console.log(this.param.id);
      this.ws.send(JSON.stringify(this.paramUpdate()));
    }
    // get response
    this.ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      // player died
      if(typeof data.game.dead != "undefined"){
        gamePlane.stop("You are dead.");
      }

      // update game properties
      this.datetime = data.game.time;
      this.time = new Date(this.datetime).getTime();
      gamePlane.fps = data.game.fps;
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
      
      // updating values
      for(const creature of data.creatures){
        let myChar;
        let charId;
        if(!gamePlane.creatures.ids.includes(creature.id)){
          if(creature.name == urlParams.get('player')){
            player = new Creature("player",player.position,urlParams.get('player')); 
            myChar = player;
          }else{
            let type = "monster";
            if(creature.type == "player"){type = "enemy";}
            myChar = new Creature(type,creature.position,creature.name);
          }
          gamePlane.creatures.list.push(myChar);
          charId = gamePlane.creatures.list.length-1;
          // charId = myChar.id;
        }else{
          // find it in gamePlane.creatures.list
          for(const [i,pl] of gamePlane.creatures.list.entries()){
            if(pl.id == creature.id){
              myChar = creature;
              charId = i;
            }
          }
          // update console
          if(creature.name == player.name && creature.text != ""){
            inGameConsole.text = creature.text;
            // console.log(creature.text);
          }
        }
        // updating values
        for(const key of Object.keys(creature)){
          if(key == "position"){
            if(!compareTables(gamePlane.creatures.list[charId]["newPos"],creature[key])){
              gamePlane.creatures.list[charId]["oldPos"] = gamePlane.creatures.list[charId]["newPos"];
              gamePlane.creatures.list[charId]["newPos"] = creature[key];
              gamePlane.creatures.list[charId]["walkingStart"] = serv.time;
            }
            continue;
          }
          if(key == "health"){gamePlane.creatures.list[charId]["oldHealth"] = gamePlane.creatures.list[charId]["health"];}
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
          // if(key == "shotPosition"){
          //   gamePlane.creatures.list[charId].lastShotPosition = gamePlane.creatures.list[charId].shotPosition;
          //   gamePlane.creatures.list[charId].shotPosition = creature.shotPosition;
          //   continue;
          // }
          if(key == "type"){continue;}
          gamePlane.creatures.list[charId][key] = creature[key];
        }
      }

      // show dev info
      // dev.stats = data.game;
      dev.stats.time = serv.time;
      dev.stats.db = data.game.db;
      dev.stats.player = player.name;
      dev.stats.health = player.health;
      dev.stats.position = player.position;
      dev.stats.grids = map.grids.length;
      dev.stats.url = urlParams.get('player');
      dev.stats.ping = this.time - player.lastFrame;
      dev.stats.cpu = data.game.cpu;
      // dev.stats.ws = JSON.stringify(gamePlane.creatures.list);
      dev.update();
      
      /* 
      new version
      // console.log("get.");
      const data = JSON.parse(msg.data);
      this.datetime = data.game.time;
      this.time = new Date(data.game.time).getTime();
      gamePlane.fps = data.game.fps;
      
      

      // get names of online players for kicking offlines
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
      
      // updating values
      for(const creature of data.creatures){
        let isOnList = false;
        for(const cfromList of gamePlane.creatures.list){
          if(cfromList.id == creature.id){
            isOnList = true;
            // console.log(cfromList.name);
            // update values
            for(const key of Object.keys(creature)){
              if(key == "position"){
                if(!compareTables(cfromList["newPos"],creature[key])){
                  cfromList["oldPos"] = cfromList["newPos"];
                  cfromList["newPos"] = creature[key];
                  cfromList["walkingStart"] = serv.time;
                  // gamePlane.creatures.list[charId]["oldPos"] = gamePlane.creatures.list[charId]["newPos"];
                  // gamePlane.creatures.list[charId]["newPos"] = creature[key];
                  // gamePlane.creatures.list[charId]["walkingStart"] = serv.time;
                }
                continue;
              }
              if(key == "health"){
                cfromList["oldHealth"] = cfromList["health"];
                // gamePlane.creatures.list[charId]["oldHealth"] = gamePlane.creatures.list[charId]["health"];
              }
              // probably problematically
              // if(key == "skills"){
              //   let oldExp;
              //   let oldLvl;
              //   if(cfromList["type"] == "player"
              //   && isSet(cfromList["skills"])){
              //     if(cfromList.skills["exp"] != creature[key]["exp"]){
              //       oldExp = cfromList.skills["exp"];
              //     }
              //     if(cfromList.skills["level"] != creature[key]["level"]){
              //       oldLvl = cfromList.skills["level"];
              //     }
              //   }
                
              //   cfromList.skills = {};
              //   for(const k of Object.keys(creature[key])){
              //     if(k == "exp" && isSet(oldExp)){
              //       cfromList.skills["oldExp"] = oldExp;
              //     }
              //     if(k == "level" && isSet(oldLvl)){
              //       cfromList.skills["oldExp"] = oldExp;
              //     }
              //     cfromList.skills[k] = creature[key][k];
              //   }
              //   if(!isSet(oldExp)){cfromList.skills["oldExp"] = cfromList.skills["exp"]}
              //   if(!isSet(oldLvl)){cfromList.skills["oldLvl"] = cfromList.skills["level"]}
              // }               
              
              if(key == "shotPosition"){
                cfromList["lastShotPosition"] = cfromList["shotPosition"];
                cfromList["shotPosition"] = creature.shotPosition;
                // gamePlane.creatures.list[charId].lastShotPosition = gamePlane.creatures.list[charId].shotPosition;
                // gamePlane.creatures.list[charId].shotPosition = creature.shotPosition;
                continue;
              }
              if(key == "type"){continue;}
              cfromList[key] = creature[key];
            }
            // console.log(cfromList);
          }
          // console.log(cfromList.id);
          // console.log(data.game.player);
          if(cfromList.id == data.game.player){
              player = cfromList;

              // console.log(player);
            }

        }
        if(!isOnList){
          gamePlane.creatures.list.push(new Creature(creature.type,creature.position,creature.name,creature.id));
        }




        // end of new way


        // let charId; 
        // if(!gamePlane.creatures.ids.includes(creature.id)){
        //   let newChar;
        //   // if not exsists - create it. 
        //   if(creature.id == data.game.player){
        //     player = new Creature("player",player.position,urlParams.get('player')); 
        //     newChar = player;
        //   }else{
        //     let type;(creature.type == "player")?type = "enemy":type = "monster";
        //     newChar = new Creature(type,creature.position,creature.name);
        //   }
        //   gamePlane.creatures.list.push(newChar);
        // }else{
        //   // find it in gamePlane.creatures.list
        //   // for(const [i,pl] of gamePlane.creatures.list.entries()){
        //   //   if(pl.id == creature.id){
        //   //     myChar = creature;
        //   //     // charId = i;
        //   //   }
        //   // }
        //   // update console
        //   if(creature.id == data.game.player && creature.text != ""){
        //     inGameConsole.text = creature.text;
        //   }
        // }
      }
    
      // callback(data)

      // must be on the end.
      dev.stats = data.game;
      dev.stats.player = player.name;
      dev.stats.position = player.position;
      dev.stats.grids = map.grids.length;
      dev.stats.url = urlParams.get('player');
      dev.stats.ping = this.time - player.lastFrame;
      // dev.stats.ws = JSON.stringify(gamePlane.creatures.list);
      dev.update(); // */
    }
    // connection error
    this.ws.onerror = (error) => {
      gamePlane.stop();
      // console.log("Your connection is lost, ");
      console.log(error);
    }
  }
}
serv.init();
