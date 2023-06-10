class Creature {
  constructor(type,[x, y, z], pName,id){
    this.id = id;
    this.type = type;
    this.cyle = 0;
    this.name = pName;
    this.width = game.square;
    this.height = game.square;
    // this.sprite = "citizen"; 
    // this.img = map.sprites[this.sprite];
    this.hideFloor = "none";
    this.x = x ;
    this.y = y ;
    this.z = z;
    if(this.type == "player"){
      // this.x = 200;
      // this.y = 200;
      this.x = Math.floor( game.mapSize[0]/2 ) * game.square;
      this.y = Math.floor( game.mapSize[1]/2 ) * game.square;
    }
    // this.direction = 1;
    this.position = [x, y, z]; //x y z
    this.newPos =  equalArr(this.position);
    this.oldPos =  equalArr(this.position);
    this.bulletCyle = 0;
    this.targetlist = [];
    this.currentTarget = false;
    this.sendTarget = false;
    this.isTarget = false;
    this.currentExshoust = false;
    this.fistExhoust = 15;
    this.nick = {
      draw: () => {
        let ctx = gamePlane.context;
        // draw name and health bar & update mana bar
        if(this.health > 0 && this.position[2] == player.position[2]){
          // menus health bar update
          let maxBarWidth = 28;
          let barWidth = (maxBarWidth * this.health) / this.totalHealth;
          let percHealth = (100 * this.health) / this.totalHealth;
          if(percHealth > 100){
            barWidth = 28;
          }
          // UPDATE DOM BARS IN MENUS
          if(this.type == "player"){
            // barWidth = (maxBarWidth * this.health) / this.totalHealth;
            // percHealth = (100 * this.health) / this.totalHealth;
            for(const key of ["healthBar","manaBar"]){
              const DOMBar = document.querySelector("."+key);
              if(DOMBar != null && DOMBar.style.display != "none"){
              if(key == "healthBar"){
                  DOMBar.querySelector("div").style.width = percHealth+"%";
                  DOMBar.querySelector("div").style.backgroundColor = hpColor(percHealth>75?75:percHealth);
                  DOMBar.querySelector("label").innerHTML = this.health+"/"+this.totalHealth;
                }else{
                  const percMana = (100 * this.mana) / this.totalMana;
                  DOMBar.querySelector("div").style.width = percMana+"%";
                  DOMBar.querySelector("div").style.backgroundColor = 'blue';
                  DOMBar.querySelector("label").innerHTML = this.mana+"/"+this.totalMana;  
                }
              }
            }
          }
          // CANVAS RENDER
          const fontSize = 20;
          ctx.fillStyle = hpColor(percHealth);
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 1.5;
          ctx.font = '900 ' + fontSize + 'px Tahoma';
          ctx.textAlign = "center";
          ctx.fillText(this.name, this.x + 5, this.y - 22);
          ctx.strokeText(this.name, this.x + 5, this.y - 22);
          ctx.beginPath();
          ctx.rect(this.x - ( fontSize / 2 ) + 1, this.y - ( fontSize - 2 ), 30, 5);
          ctx.fillRect(this.x - ( fontSize / 2 ), this.y - ( fontSize - 3 ), barWidth, 3);
          ctx.stroke();
        }
      }
    }
		this.processing = {}
  }
  update(){

		// SETTING SERVER INFO
		if(this.serverUpdating){
			if(this.serverUpdating.walk){
				this.processing.walk = this.serverUpdating.walk
			}
		}

		// EXECUTING SERVER INFO
		if(this.processing.walk){
			this.walking()
		}

    // ITEMS UPDATE
    if(this.type == "player" && typeof this.eq != "undefined"){
      // MENUS EQ UPDATE
      for(let key of Object.keys(this.eq)){
        // eq prewiev update
        const field = document.querySelector("."+key);
        if(this.eq[key] && field != null){
          if(field.innerHTML == "" || field.innerHTML == "&nbsp;"){
            field.innerHTML = "";
            const makeNewItemFrom = this.eq[key];
            makeNewItemFrom.field = key;
            const newItem = new Item(makeNewItemFrom);
            field.append(newItem.toDOM());
          }
        }else if(field != null){
          field.innerHTML = "";
        }
      }
    }
    // SPRITE LOAD & UPDATE
    if((["player","enemy"].includes(this.type) && (!isSet(this.img)) || isSet(this.outfitUpdate) )){
      if(isSet(this.outfitUpdate)){
        delete this.outfitUpdate;
      }
      this.img = map.sprites[this.sprite];
      if(typeof this.img != "undefined"){
        const recolor = recolorImage(this.img,this.colors);
        recolor.onload = () =>{
          this.img = recolor;
        }
      }
    }
    // WALKING
    // if(this.walk >= serv.time){
    //   const walkTime = this.walk - this.walkingStart;
    //   const timeLeft = walkTime - (serv.time - this.walkingStart);
    //   // walking cyle (animation)
    //   timeLeft > walkTime/2?this.cyle = 2:this.cyle = 1;
    //   // monsers and npc's has 0 speed when stay.
    //   if(this.speed > 0){
    //     // CHANGE POSITION OF CREATURE
    //     const piece = 1 - Math.round((timeLeft/walkTime)*10)/10;
    //     this.position = equalArr(this.oldPos);
    //     for(let l of [[0,1],[1,0]]){
    //       if(this.newPos[2] != this.oldPos[2]){
    //         this.position = this.newPos;
    //       }
    //       if(this.newPos[l[0]] == this.oldPos[l[0]] ){
    //         if(this.newPos[l[1]] > this.oldPos[l[1]]){
    //           this.position[l[1]] = this.oldPos[l[1]] + piece;
    //         }else if(this.newPos[l[1]] < this.oldPos[l[1]]){
    //           this.position[l[1]] = this.oldPos[l[1]] - piece;
    //         }
    //       }
    //     }
    //   }else{
    //     // this.direction = 1;
    //     this.cyle = 0;
    //   }
    // }else{
    //   if(this.sprite != "tourets" && this.health > 0){
    //     this.cyle = 0;
    //   }
    //   this.position = this.newPos;
    // }
    // CLEAR TARGETS
    if(this.whiteTarget){
      let opp = false;
      for(const c of gamePlane.creatures.list){
        if(c.id == this.whiteTarget){
          opp = c;
        }
      }
      if(opp){
        if(this.position[2] != opp.position[2]
          || Math.abs(this.position[1] - opp.position[1]) > 5
          || Math.abs(this.position[0] - opp.position[0]) > 5
        ){
          this.whiteTarget = false;
          controls.currentTarget = -1;
          this.redTarget = "clear";        
        }
      }
    }
    // DEATH
    if(this.health <= 0){
      if(this.sprite != "tourets"){
        // this.cyle = 0;
      }
      this.direction = 4;
      if(player.whiteTarget == this.id){
        player.whiteTarget = false;
      }
      this.redTarget = false;
      controls.currentTarget = -1;
      controls.whiteTarget = false;
    }
    // SET VISIBLE FLOOR
    if(this.type == "player"){
      // check windows around
      let isWindow = false;
      const z = player.newPos[2];
      const checkIfWindows = [
        [player.newPos[0],player.newPos[1]-1],
        [player.newPos[0],player.newPos[1]+1],
        [player.newPos[0]-1,player.newPos[1]],
        [player.newPos[0]+1,player.newPos[1]]
      ];
      for(const ch of checkIfWindows){
        for(const g of map.getGrid([ch[0],ch[1],z])){
          if(g[4] == "windows"){
            isWindow = true;
          }
        }  
      }
      // if player is under ground
      if(this.position[2] < 0){
        map.visibleFloor = z;
      // if is something above player [level up]
      }else if(map.getGrid([this.newPos[0],this.newPos[1],this.newPos[2]+1])[0]){
        map.visibleFloor = z;
      // if is something above player [2 level up]
      }else if(map.getGrid([this.newPos[0],this.newPos[1],this.newPos[2]+2])[0]){
        map.visibleFloor = z+1;
      // if player is near window
      }else if(isWindow){
        map.visibleFloor = z;
      }else{
        map.visibleFloor = map.maxFloor;
      }
    }
    // SET OTHER CREATURES DEPENDS OF PLAYER POSITION
    if(this.type != "player" && typeof player.position != null){
      this.x = (this.position[0] - player.position[0] + Math.floor( game.mapSize[0] / 2 )) * game.square;
      this.y = (this.position[1] - player.position[1] + Math.floor( game.mapSize[1] / 2 )) * game.square;  
    }
  }
  draw(){
    let ctx = gamePlane.context;
    // SAYING
    if(this.name == player.name){
      // RENDER ALL SAYS NEAR
      for(const creature of gamePlane.creatures.list){
        if(isSet(creature.says) && creature.says != ""){
          if(["player","enemy"].includes(creature.type)){
            menus.console.log(creature.name+"["+creature.skills.level+"]: "+creature.says);
            if(creature.type == "player"){
              menus.console.lastPharses.push(creature.says);
            }
          }else if(creature.type == "npc"){
            menus.console.log(creature.name+": "+creature.says);
          }
          gamePlane.actions.push(new Action("says",creature.position[0],creature.position[1],100,200,[creature.name,creature.says],900));
          delete creature.says;
        }
      }
    }
    // draw half of whiteTarget
    if(player.whiteTarget == this.id){
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.moveTo(this.x +3,this.y + 37);
      ctx.lineTo(this.x +3, this.y);
      ctx.lineTo(this.x +38, this.y);
      ctx.stroke();
    }
    // draw fist half of redTarget
    if(this.id == player.redTarget & this.health > 0){
      ctx.beginPath();
      ctx.fillStyle = "red";
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 3;
      ctx.moveTo(this.x,this.y + 41.5);
      ctx.lineTo(this.x, this.y-3);
      ctx.lineTo(this.x +41.5, this.y-3);
      ctx.stroke();  
    }
    // draw sprite
    if(this.position[2] <= map.visibleFloor){
      if(["player","enemy"].includes(this.type)){
          // draw colors masks
          if(!this.img){return }
          const cw = this.img.width/6;
          ctx.drawImage(
            this.img, (this.cyle+3) * cw, this.direction * cw, cw, this.img.height/5,
            this.x - game.square, this.y-game.square, 100, 100
          );
          // draw else elements xD
          ctx.drawImage(
            this.img, this.cyle * cw, this.direction * cw, cw, this.img.height/5,
            this.x - game.square, this.y-game.square, 100, 100
          );
      }else{
        const img = map.sprites[this.sprite];
        ctx.drawImage(
          img, this.cyle * img.width/3, this.direction * img.width/3, img.width/3, img.height/5,
          this.x - game.square, this.y-game.square, 100, 100
        );
      }
    }
    // draw second half of whiteTarget
    if(player.whiteTarget == this.id){
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.moveTo(this.x + 1.5 ,this.y + 37);
      ctx.lineTo(this.x + 37, this.y +37);
      ctx.lineTo(this.x + 37, this.y);
      ctx.stroke();
    }  
    // draw second half of redTarget
    if(this.id == player.redTarget & this.health > 0){
      ctx.beginPath();
      ctx.fillStyle = "red";
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 3;
      ctx.moveTo(this.x  ,this.y + game.square);
      ctx.lineTo(this.x + game.square, this.y + game.square);
      ctx.lineTo(this.x + game.square, this.y -1);
      ctx.stroke();  
    }
    // draw hits and healing value
    if(isSet(this.oldHealth) && this.oldHealth != this.health){
      const hitValue = this.oldHealth - this.health;
      gamePlane.actions.push(new Action("hitText",this.position[0],this.position[1],100,200,hitValue));
      if(this.type == "player" && hitValue > 0){
        joyPad.vibrate((hitValue/this.totalHealth),10);
      }else if(this.type == "player"){
        joyPad.vibrate();
      }
    }
    // draw exp value     
    if(isSet(this.skills) && isSet(this.skills.oldExp) && this.skills.exp != this.skills.oldExp && this.type == "player"){
      const expValue = this.skills.exp - this.skills.oldExp;
      gamePlane.actions.push(new Action("expText",this.position[0],this.position[1],100,200,expValue));
      this.skills.oldExp = this.skills.exp;
    }
    // drav level promotion
    if(isSet(this.skills) &&isSet(this.skills.oldLvl) && this.skills.level != this.skills.oldLvl && this.type == "player"){
      if(this.skills.oldLvl != 0){
        gamePlane.actions.push(new Action("centerTxt",this.position[0],this.position[1],100,200,this.skills.level,3000));
      }
      this.skills.oldLvl = this.skills.level;
    }
    // HEALING amount
    if(this.oldHealth < this.health){
      gamePlane.actions.push(new Action("misc",this.x,this.y,game.square,game.square,2));
    }
    // DISTANCE SHOT
    if(this.bulletOnTarget >= serv.time){
      if(isSet(this.shotBullet)){
        // get victim to set bullet end position
        for(const c of gamePlane.creatures.list){
          if(c.id == this.shotTarget){
            this.shotVictim = c;
          }
        }
        const piece = 100 - Math.round(((this.bulletOnTarget - serv.time)*100)/(this.bulletOnTarget - this.startBullet));
        if(isSet(this.shotVictim)){
          // X POS
          const pX = ((Math.abs(this.shotVictim.position[0] - this.position[0])*piece) / 100);
          this.shotVictim.position[0]<this.position[0]?this.shotBullet.x=this.position[0]-pX:this.shotBullet.x=this.position[0]+pX;
          // Y POS
          const pY = ((Math.abs(this.shotVictim.position[1] - this.position[1])*piece) / 100);
          this.shotVictim.position[1]<this.position[1]?this.shotBullet.y=this.position[1]-pY:this.shotBullet.y=this.position[1]+pY;
          this.shotBullet.update();
        }
      }else{
        // first time
        this.shotBullet = new Action("bullet",this.position[0],this.position[1],10,10,1);
        this.startBullet = serv.time;
      }
    }else{
      // last bullet
      if(typeof this.shotBullet != "undefined" && typeof this.shotVictim != "undefined"){
        gamePlane.actions.push(new Action("misc",this.shotVictim.position[0],this.shotVictim.position[1],game.square,game.square,1));
        delete this.shotBullet;
        delete this.startBullet;
      }
    }
  }

	walking(){

		const data = this.processing.walk
		const time = new Date().getTime();
		const time_processing = data.time_end - data.time_start
		const time_current = time - data.time_start
		const percentage =  ((100 * time_current) / time_processing) / 100

		// end process on time end
		if(time - data.time_end > 0){
			this.cyle = 0;
			this.position = this.processing.walk.position_end
			return delete this.processing.walk
		}

		// change position on x and y axis
		for(const axis of [0, 1]){
			if(data.position_start[axis] != data.position_end[axis]){
				const difference = data.position_start[axis] - data.position_end[axis]
				const valueToMove = (data.position_start[axis] - (difference * percentage)).toFixed(2) * 1
				this.position[axis] = valueToMove
			}
		}

		// animate steps
		this.cyle = 2;
		if(( 0.25 < percentage && percentage < 0.50 ) || 0.75 < percentage ){
			this.cyle = 1;
		}
		
	}
}