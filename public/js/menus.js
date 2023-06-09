const menus = {
  gamePlane : document.querySelector(".gamePlane"),
  menus : [
    "outfit",
    "mainMenu",
    "console"
  ],
  buttons:[],
  init(){
    // CREATING VISIBLE BUTTONS TO OPEN MENUS
    for(const m of ['outfit','mainMenu','toggleControls']){
      const dom = document.createElement("div");
      dom.className = "menusButtons "+m;
      // dom.innerHTML = m;
      dom.innerHTML = "x";
      document.querySelector(".gamePlane").append(dom);
      if(m == 'outfit'){
        dom.innerHTML = "&blacktriangleright;";
      }else if(m == 'mainMenu'){
        dom.innerHTML = "&blacktriangleright;";
      }else{
        dom.innerHTML = "&blacktriangleright;";
        dom.style.display = "none";
        // dom.className = "mobileControlsToggler";
      }
      dom.onclick = () => {
        const displayedMenu = m == 'toggleControls' ? document.querySelector(".wrapper >.mobileControls") : document.querySelector(".wrapper >."+m);
        if(displayedMenu == null){
          this[m].show(m);
        }else if(displayedMenu.style.display == "none"){
          dom.innerHTML = "&blacktriangleright;";
          this[m].show(m);
        }else{
          dom.innerHTML = "&blacktriangleleft;";
          this[m].close(m);
        }
      }
      // show/hide menu on cookies
      if(m == 'mainMenu' && document.cookie.match("mainMenu") != null){
        for(const cookie of document.cookie.split("; ")){
          const [k,v] = cookie.split("=");
          if(k == "mainMenu"){
            if(v == "hide"){
              this[m].close(m);
            }
          }
        }

      }
    }
    // initialize menus
    for(const menu of this.menus){this[menu].init();}
  },
  toggleControls:{
    show(){
      const doms = document.querySelectorAll(".wrapper >.mobileControls");
      for(const dom of doms){
        dom.style.display = "flex";
      }
    },
    close(){
      const doms = document.querySelectorAll(".wrapper >.mobileControls");
      for(const dom of doms){
        dom.style.display = "none";
      }
    }
  },
  mainMenu:{
    parent: document.querySelector(".mainMenu"),
    automation(dom, update = 'default'){
      if(dom.classList.contains("enable")){
        if("AUTO SHOOTER" == dom.title){
          if(!dom.classList.contains("active")){
            serv.param.autoShot = true;
            dom.classList.add("active");
          }else{
            serv.param.autoShot = false;
            dom.classList.remove("active");
          }
        }
        if("AUTO WALLER" == dom.title){
          if(update != 'default'){
            // from serv auto update.
            if(update){
              if(!dom.classList.contains("active")){
                dom.classList.add("active");
              }  
            }else{
              if(dom.classList.contains("active")){
                dom.classList.remove("active");  
              }
            }
          }else{
            if(!dom.classList.contains("active")){
              serv.param.autoMWDrop = true;
              dom.classList.add("active");
            }else{
              serv.param.autoMWDrop = false;
              dom.classList.remove("active");
            }  
          }
        }
      }
    },
    doms : [
      [
        { title: "PAUSE GAME",
          innerHTML: "⏸",
          type: "a",
          onclick: () => {gamePlane.stop();}
        },
        { title: "REFRESH GAME",
          innerHTML: "🔄",
          type: "a",
          onclick: () => {location.reload()}
        },
        { title: "MAIN PAGE",
          innerHTML: "🏡",
          type: "a",
          href: "./"
        },
        { title: "LOGOUT",
          innerHTML: "🚪",
          type: "a",
          // href: "./account.html?action=logout"
          href: "/acc/logout"
        }
      ],
      [{ title:"HEALTH",
          type:"div",
          className:"healthBar",
          innerHTML: "<div class='progressBar'></div><label>NaN</label>",
        }
      ],
      [{ title:"MANA",
          type:"div",
          className:"manaBar",
          innerHTML: "<div class='progressBar'></div><label>NaN</label>",
        }
      ],
      [{title:"AUTOMATION",
        type:"div",
        className: "automation",
        innerHTML : `
          <div class='title'>Automation</div>
          <div class='automationContainer'>
            <div class='shooterDOM enable' title='AUTO SHOOTER' onclick='menus.mainMenu.automation(this)'>SHOOTER</div>
            <div class='wallerDOM enable' title='AUTO WALLER' onclick='menus.mainMenu.automation(this)'>WALLER</div>
          </div>
         `,
        }
      ],
      [{title:"EQUIPMENT",
        type:"div",
        className: "eq",
        innerHTML : `
          <div class='title'>Equipment</div>
          <div class='row'>
            <div class="nc"></div>
            <div class="hd">&nbsp;</div>
            <div class="bp"></div>
          </div>
          <div class='row'>
            <div class="lh"></div>
            <div class="ch">&nbsp;</div>
            <div class="rh"></div>
          </div>
          <div class='row'>
            <div class="lg">&nbsp;</div>
          </div>
          <div class='row'>
            <div class="ft">&nbsp;</div>
          </div>
         `
        }
      ],
      [{title:"SKILLS",
        type:"div",
        className: "skills",
        innerHTML : `
          <div class='title'>Skills</div>
          <div class='displaySkills'>
          </div>
        `
       }
      ]
    ],
    init(){
      this.build("PAUSE GAME");
      this.build("HEALTH");
      this.build("MANA");
      this.build("AUTOMATION");
      this.build("EQUIPMENT");
      this.build("SKILLS");
    },
    opened:[],
    build(menuName,options = {}){
      this.opened.push([menuName,options])
      // build it
      for(const key of Object.keys(options)){
        this[key] = options[key];
      }
      this.menuName = menuName;
      this.dom = document.createElement("div");
      // build capable items
      if(isSet(options.cap)){
        if(isSet(options.parent)){
          this.capableItems.close(options.parent);
        }
        if(!isSet(options.openedContainer)){
          this.capableItems.open(options);
        }else{
          this.capableItems.close(options);
        }
      }

      // if(isSet(options.cap)){
      //   // this.capableItems.build(menuName,options);
      //   this.capableItems.open(options);
      // //   // console.log(options)
      // }
      for(const [i,row] of this.doms.entries()){
        // BUILD FROM TEMPLATE
        if(this.menuName == row[0].title){
          this.dom.className = "menuItem"+i;
          for(const b of row){
            const e = document.createElement(b.type);
            for(const key of Object.keys(b)){
              // exceptions
              if(key == "title" && menuName == "EQUIPMENT"){continue;}
              if(!["type"].includes(key) ){
                e[key] = b[key];
              }
            }
            this.dom.append(e);
          }
        }
      }
      // MAKE COLLAPSING TITLE
      const title = this.dom.querySelector(".title");
      if(title != null){
        const collapseButton = document.createElement("div");
        collapseButton.innerHTML = "&bigtriangleup;"
        title.onclick = () => {
          const menuItem = collapseButton.parentElement.parentElement.parentElement;
          const mainMenuDOM = collapseButton.parentElement.parentElement.parentElement.parentElement;
          if(collapseButton.parentElement.parentElement.classList.contains("collapsed")){
            // prepend it
            collapseButton.parentElement.parentElement.parentElement.remove();
            mainMenuDOM.prepend(menuItem);

            collapseButton.parentElement.parentElement.classList.remove("collapsed");
            collapseButton.innerHTML = "&bigtriangleup;"
          }else{
            collapseButton.parentElement.parentElement.parentElement.remove();
            mainMenuDOM.append(menuItem);

            
            collapseButton.parentElement.parentElement.classList.add("collapsed");
            collapseButton.innerHTML = "&bigtriangledown;"
          
          }
        }
        title.append(collapseButton)
        // const x = document.createElement("div");
        // if(this.menuName == "BACKPACK"){
        //   x.innerHTML = "x";
        //   title.append(x);
        //   x.onclick = () => {this.close(this.dom,this.menuName)};
        // }
      }
      // MAIN NAVBAR & hp & mana ALWAYS ON TOP
      if(["PAUSE GAME","HEALTH","MANA"].includes(menuName)){
        document.querySelector(".wrapper").append(this.dom);
      }else{
        this.parent.append(this.dom);
      }
    },
    update(){
      // SKILLS UPDATE
      const forCountingKeys = [
        "exp",
        "fist_summary",
        "dist_summary",
        "def_summary",
        "magic_summary"
      ]
      const notShowing = [
        "oldExp",
        "oldLvl"
      ];
      
      let refreshSkills = false;
      if(isSet(this.skills)){
        for(const key of Object.keys(player.skills)){
          if(this.skills[key] != player.skills[key] && !notShowing.includes(key)){
            this.skills[key] = player.skills[key];
            refreshSkills = true;
            // skillsToRefresh.push(key);
          }
        }
      }else{
        if(isSet(player.skills)){
          this.skills = player.skills;
          refreshSkills = true;  
        }
      }

      const result = document.querySelector(".displaySkills");
      const displaySingleSkill = () =>{
        result.innerHTML = "";
        for(const key of Object.keys(this.skills)){
          // console.log(key)
          // if(['magic_summary'].includes(key)){
          //   console.log(this.skills[key])

          // }
          if(notShowing.concat(forCountingKeys).includes(key)){continue;}
          const row = document.createElement("div");
          row.innerHTML = "<div>"+key+"<div>"
          row.innerHTML += "<div>"+this.skills[key]+"<div>"
          result.append(row);
          const progressBar = document.createElement("div");
          progressBar.className = "progressBar";
          if(['level'].includes(key)){
            startThisLevel = Math.pow((this.skills.level-1),3);
            expToLvl = Math.pow((this.skills.level),3);
            secondKey = "exp"
          }else if(['fist','dist','def','magic'].includes(key)){
            // startThisLevel = Math.pow((this.skills[key]-1),2);
            // expToLvl = Math.pow((this.skills[key]),2);
            startThisLevel = Math.pow((this.skills[key]-1),3);
            expToLvl = Math.pow((this.skills[key]),3);
            secondKey = key+"_summary";
          }
          const percent = ((this.skills[secondKey]-startThisLevel)*100)/(expToLvl-startThisLevel);
          progressBar.innerHTML = "<div class='progress' style='width:"+percent+"%;'></div>";
          progressBar.innerHTML += "<div>"+(this.skills[secondKey]-startThisLevel)+"/"+(expToLvl-startThisLevel)+"</div>";
          progressBar.title = this.skills[secondKey]+"/"+expToLvl;
          result.append(progressBar);
        }
      } 
      if(refreshSkills && result != null ){
        displaySingleSkill();
      } 
    },
    twiceClick(item){
      // this.build("Backpack", item)
     if(isSet(item.cap)){
        if(isSet(item.parent)){
          this.capableItems.close(item.parent);
        }
        if(!isSet(item.openedContainer)){
          this.capableItems.open(item);
        }else{
          this.capableItems.close(item);
        }
      }
      this.resize();
    },
    resize(){
      // eq
      const squares = this.parent.querySelectorAll(".eq > .row > div");
      for(const square of squares){
        square.style.width = square.offsetHeight+"px";
        square.style.height = square.offsetHeight+"px";
      }
      // bp squares
      const bpRow = this.parent.querySelectorAll(".backpack > .row");
      for(const row of bpRow){
        const sqs = row.querySelectorAll("div");
        for(const sq of sqs){
          // 12 is border + margin
          sq.style.width = Math.floor((row.offsetWidth-12)/4)+"px";
          sq.style.height = Math.floor((row.offsetWidth-12)/4)+"px";
        }
      }

      // gamePlane
      // const gamePlane = this.parent.querySelectorAll(".gamePlane");
      // if(gamePlane){
      //   console.log('RESIZING GP')
      //   // consol
      // }

    },
    show(DOMClassName){
      document.cookie = "mainMenu=show;";
      const oFC = document.querySelector(".wrapper >."+DOMClassName);
      const gameAndConsole = document.querySelector(".gameAndConsole");
      if(oFC != null){
        oFC.style.display = "flex";
        gameAndConsole.style.cssText = "";
      }
    },
    close(menuName){
      document.cookie = "mainMenu=hide;";
      const dom = document.querySelector(".wrapper >."+menuName);
      const gameAndConsole = document.querySelector(".gameAndConsole");
      if(dom != null){
        gameAndConsole.style.cssText = "min-width: 100% !important; flex-grow: 0;";
        dom.style.display = "none";
      }
      for(const openField of this.opened){
        if(openField[0] == menuName){
          this.opened.splice(this.opened.indexOf(openField),1);
        }
      }
    },
    capableItems : {
      opened : new Map(),
      refresh(){
        for(const [whenOpened, item] of this.opened){
          // MAKE OR CLEAR ROW FOR ITEMS FIELD
          let isRow = false; for(const child of item.openedContainer.children){
            if(child.classList.contains("row")){
              isRow = child;
            }
          }const row = isRow ? isRow : document.createElement("div");
          row.innerHTML = ""; row.className = "row";

          // CHECK THE BACKPACK POSITION
          let itemIn;
          if(item.name == "Locker"){
            itemIn = player.locker.in;
          }else{
            itemIn = player.eq[item.field.split(",")[0]].in;          
          }
          if(item.field.includes(",") && isSet(itemIn)){
            // bp from bp etc.
            for(let inLevel = 0; inLevel < item.field.split(",").length; inLevel++){
              if(inLevel){
                 itemIn = itemIn[item.field.split(",")[inLevel]].in
              }
            }         
          }

          // CREATE ITEMS INSIDE BACKPACK
          const inItems = [];
          if(isSet(itemIn)){
            for(const [i,inItem] of itemIn.entries()){
              const insideItem = new Item(inItem);
              insideItem.parent = item;
              // sending to serv : parent field, index
              insideItem.field = item.field+","+i
              inItems.push(insideItem);
            }
          }
          // MAKE SQUARES AND FILL IT BY ITEMS
          for(let i = 0; i < item.cap; i++){
            const sq = document.createElement("div");
            row.append(sq);    
            // FILL SQUARES BY ITEMS
            if(isSet(inItems[i])){
              sq.append(inItems[i].toDOM());
            }
          }
          item.openedContainer.append(row);
        }
      },
      close(item){
        // console.log("DELETING")
        // if(isSet(item.openedContainer)){
          item.openedContainer.remove();
        // }
        this.opened.delete(item.whenOpen);
        delete item.openedContainer;
      },
      open(item){
        const title = document.createElement("div");
        // title.innerHTML = "Backpack";
        title.innerHTML = item.name;
        title.className = "title";

        if(item.parent){
          const moveUp = document.createElement("div");
          title.append(moveUp);
          moveUp.innerHTML = "↑";
          moveUp.onclick = () => {
            this.open(item.parent);
            this.close(item);
          }
  
        }

        const x = document.createElement("div");
        x.innerHTML = "x";
        x.onclick = () => {this.close(item)};
        title.append(x);

        item.openedContainer = document.createElement("div");
        item.openedContainer.className = "backpack";
        item.openedContainer.append(title);
        menus.mainMenu.dom.append(item.openedContainer);

        item.whenOpen = new Date().getTime();
        this.opened.set(item.whenOpen,item);
        this.refresh();
      }
    }
  },
  resize(){
    this.mainMenu.resize();
  },
  outfit:{
    div:document.createElement("div"),
    init(){
    },
    resize(){
      const x = (window.innerWidth - document.querySelector(".gamePlaneCanvas").clientWidth)/2;
      const y = window.innerHeight/4;
      this.div.style.cssText = `
        position:fixed;
        left:`+x+`px;
        top:`+y+`px;
      `;
    },
    show(){
      // clear old frames
      for(const frame of document.querySelectorAll(".outFitContainer")){
        frame.remove();
      }
      // get avalible sprites
      for(const sprite of sprites){
        if(sprite.group == "outfits" && sprite.name.split("_")[0] == player.sex){
          this.tools.sprites.push(sprite.name);
        }
      }
      // set colors
      let colors;
      if(isSet(player.colors)){
        colors = player.colors;
      }else{
        colors = {
          head : [0,0,0],
          chest : [255,0,0],
          legs : [255,0,0],
          foots : [0,255,0]
        };
      }
      this.tools.colors = colors;
      this.build();
    },
    build(){
      const container = document.createElement("div");
      container.className = "outFitContainer";
      container.style.cssText = "min-width:"+Math.round(gamePlane.canvas.offsetWidth*0.8)+"px";
      menus.gamePlane.append(container);

      const innerContainer = document.createElement("div");
      innerContainer.className = "innerContainer";
      container.append(innerContainer);

      const canvas = document.createElement("canvas");
      canvas.className = "preview";
      canvas.width = 40;
      canvas.height = 40;
      innerContainer.append(canvas);
      canvas.style.cssText = `
        border:2px solid;
        border-color:#444444 #737373 #737373 #444444;
        flex:2;
        padding:20px;
      `;
      this.tools.preview("firstTime");

      const layerPicker = document.createElement("div");
      layerPicker.className = "layerPicker";
      innerContainer.append(layerPicker);
      this.tools.layerPicker();

      const colorPicker = document.createElement("div");
      colorPicker.className = "colorPicker";
      innerContainer.append(colorPicker); 
      this.tools.colorPicker();

      canvas.style.height = canvas.offsetWidth+"px";

      const footer = document.createElement("div");
      footer.style.cssText = `
        display:flex;  
        padding:10px;
      `;container.append(footer);

      const spriteChanger = document.createElement("div");
      spriteChanger.className = "spriteChanger";
      spriteChanger.style.cssText = `
        display:flex;
        flex:2;
        align-items:center;
      `;footer.append(spriteChanger);
      this.tools.spriteChanger();

      const resultButtons = document.createElement("div");
      resultButtons.className = "resultButtons";
      resultButtons.style.cssText = `
        display:flex;  
        flex:6;
        justify-content:flex-end;
        font-size:0.7em;
      `;footer.append(resultButtons);
      this.tools.resultButts();
    },
    tools:{
      layer:"head",
      sprites:[],
      activeSprite:0,
      preview(how = "default"){
        const canvas = document.querySelector(".preview");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      
        let img;
        if(how == "firstTime"){
          img = map.sprites[player.sprite];
        }else{
          img = map.sprites[this.sprites[this.activeSprite]];
        }
        
        img = recolorImage(img,this.colors);
        this.cyle = 0;
        this.direction = 1;
        this.x = -20;
        this.y = -20;
        img.onload = () =>{
          ctx.drawImage(
            img, this.cyle+3 * img.width/6, this.direction * img.width/6, img.width/6, img.height/5,
            this.x, this.y, 80, 80
          );
          ctx.drawImage(
            img, this.cyle * img.width/6, this.direction * img.width/6, img.width/6, img.height/5,
            this.x, this.y, 80, 80
          );
        }
      },
      spriteChanger(){
        const spriteChanger = document.querySelector(".spriteChanger");
        spriteChanger.innerHTML = "";
        // make text value
        const textField= document.createElement("div");
        textField.className = "textField";
        textField.style.cssText = `
          border:2px solid;
          border-color:#444444 #737373 #737373 #444444;
          display:flex;
          justify-content:center;
          align-items:center;
          margin:0 3px;
          font-size:0.7em;
          flex:1;
          width:40px;
          height:2em;
          padding:0 20px;
        `;
        
        // GET OUTFIT SPRITES
        let sName;
        this.sprites = [];
        for(const sprite of sprites){
          if(sprite.group == "outfits" 
          && sprite.name.split("_")[0] == player.sex){
            this.sprites.push(sprite.name);
          }
        }
        const text = document.createElement("span");
        if(isSet(this.sprites[this.activeSprite])){
          sName = this.sprites[this.activeSprite];
        }else{
            sName = player.sprite;
        }
        text.innerHTML = capitalizeFirstLetter(sName.split("_")[1]);
        textField.append(text);
        // build buttons
        const button = {
          left: document.createElement("div"),
          right: document.createElement("div")
        }
        for(const butt of Object.keys(button)){
          spriteChanger.append(button[butt]);
          button[butt].style.cssText = `
            background-color:#404040;
            color:#AEAEAC;
            padding:0 3px;
            border:2px solid; 
            border-color:#757575 #323232 #323232 #757575;
            cursor:pointer;
            display:flex;
            justify-content:center;
            align-items:center;
            height:1.2em;
          `;
          if(butt == "left"){
            button[butt].innerHTML = "&blacktriangleleft;"
            spriteChanger.append(textField);
          }else{
            button[butt].innerHTML = "&blacktriangleright;";
          }
          button[butt].onclick = () => {
            if(butt == "left"){
              this.activeSprite++;
              if(this.activeSprite > this.sprites.length-1){
                this.activeSprite = 0;
              }
            }else{
              this.activeSprite--;
              if(this.activeSprite < 0){
                this.activeSprite = this.sprites.length-1;
              }
            }
            this.spriteChanger();
            this.preview("spriteChanged");
          }
        }
      },
      resultButts(){
        const resultButtons = document.querySelector(".resultButtons");
        const css = `
          padding:5px;
          margin:0 3px;
        `;
        for(const text of ["Apply","Cancel"]){
          const button = document.createElement("button");
          button.innerHTML = text;
          button.style.cssText = css;
          resultButtons.append(button);
          if(text == "Apply"){
            button.onclick = () => {
              menus.outfit.close();
              controls.update([
                "outfit",{
                  sprite:this.sprites[this.activeSprite],
                  colors:this.colors
                }
              ])
            }
          }
          if(text == "Cancel"){
            button.onclick = () => {menus.outfit.close();}
          }
        }
      },
      layerPicker(){
        const layerPicker = document.querySelector(".layerPicker");
        layerPicker.innerHTML = "";
        for(const k of ["head","chest","legs","foots"]){
          const button = document.createElement("div");
          button.innerHTML = k;
          button.style.cssText = `
            background-color:#404040;
            color:#AEAEAC;
            padding:5px;
            border:2px solid;
            cursor:pointer; 
            min-height:20%;
            font-size:0.7em;
          `;
          if(this.layer == k){
            button.style.borderColor = "#323232 #757575 #757575 #323232";
          }else{
            button.style.borderColor = "#757575 #323232 #323232 #757575";
          }
          button.onclick = () => {
            this.layer = k;
            this.layerPicker();
            this.colorPicker();
          }
          layerPicker.append(button);        
        }
      },
      colorPicker(){
        const colorPicker = document.querySelector(".colorPicker");
        colorPicker.innerHTML = "";
        const colorLength = 9;
        const maxColor = 240;
        const f = 255/colorLength;  // fullcolor
        const h = f/2; // halfcolor
        for(const barwa of [
          [f,f,f],
          [0,f,f],
          [0,f,h],
          [0,f,0],
          [0,h,h],
          [0,h,f],
          [0,0,f],
          [f,0,f],
          [h,0,h],
          [f,0,0],
          [f,f,0],
          [h,h,0],
        ]){
          const col = document.createElement("div");
          col.style.cssText = `
            display:flex;
            flex-direction:column;
            width:100%;
          `;colorPicker.append(col);
          for(let i = 1; i <= colorLength-1; i++){
            const pColor = [Math.round(maxColor-barwa[0]*i),Math.round(maxColor-barwa[1]*i),Math.round(maxColor-barwa[2]*i)];
            const singleColor = document.createElement("div");
            singleColor.style.cssText = `
              width:100%;
              height:100%;
              margin:1px;
              border: 3px solid;
              background-color:rgb(${pColor[0]},${pColor[1]},${pColor[2]})
            `;
            if(compareTables(pColor,this.colors[this.layer])){
              singleColor.style.borderColor = "#2A222F #747474 #747474 #2A222F";
            }else{
              singleColor.style.borderColor = "#747474 #2A222F #2A222F #747474";
            }
            singleColor.onclick = () => {
              this.colors[this.layer] = pColor;
              this.preview();
              this.colorPicker();
            }
            col.append(singleColor);
          }
        }
      }
    },
    close(){
      const oFC = document.querySelector(".outFitContainer");
      if(oFC != null){
        document.querySelector(".outFitContainer").remove();
      }
    }
  },
  console:{
    parent: document.querySelector(".gameAndConsole"),
    lastPharses: [],
    currentPharse: 0,
    init(){
      this.dom = document.createElement("div");
      this.dom.className = "console";
      this.messages = document.createElement("div");
      this.messages.className = "messages";
      this.log("Welcome in " + game.name + " v" + game.version, {color:"#0f0"} )
      this.input = document.createElement("input");
      this.input.className = 'messagesInput';
      this.input.setAttribute('spellcheck', 'false');
      this.input.onkeydown = (e) => {
        if((e.key == 'ArrowUp' || e.key == 'ArrowDown') && menus.console.lastPharses.length > 0){
          if(e.key == 'ArrowUp'){
            if(!menus.console.currentPharse){
              menus.console.currentPharse = menus.console.lastPharses.length - 1;
            }else{
              menus.console.currentPharse -= 1;
            }
          }else{
            if(menus.console.currentPharse >= menus.console.lastPharses.length -1){
              menus.console.currentPharse = 0;
            }else{
              menus.console.currentPharse += 1;
            }
          }
          menus.console.input.value = menus.console.lastPharses[menus.console.currentPharse];
        }
        if(e.key == "Enter"){
          menus.console.currentPharse = 0;
        }
      }
      this.dom.append(this.input);
      this.dom.prepend(this.messages);
      this.parent.append(this.dom);
    },
    log(message,params = {}){
      let styles = "";
      for(const key of Object.keys(params)){
        if(key == "color"){styles += key+":"+params[key]+";"}
      }
      const time = ("0" + new Date().getHours()).slice(-2)+":"+("0" + new Date().getMinutes()).slice(-2);
      this.messages.innerHTML += "<span style='"+styles+"'>"+time+" "+message+"</span>";
      this.messages.scrollTop = this.messages.scrollHeight;
    },
    resize(){

    }
  },
  update(){
    this.mainMenu.update();

		if(!player?.eq){ return }
    // REFRESH AMOUNT OF ITEMS IN EQ
    for(const eqField of Object.keys(player.eq)){
      if(isSet(player.eq[eqField].amount)){
        const itemContainer = document.querySelector(".eq ."+eqField+" .itemContainer");
        if(player.eq[eqField].amount != itemContainer.dataset.amount){
          const thisEqDOM = document.querySelector(".eq ."+eqField);
          const newItem = new Item(player.eq[eqField]);
          newItem.field = eqField;
          thisEqDOM.innerHTML = "";
          thisEqDOM.append(newItem.toDOM());
        }
      }
    }

    // COUNT ITEMS FOR REFRESH OPENED BP'S
    let playerItemsLength = 0;
    for(const item of Object.keys(player.eq)){
      // COUNT ITEMS IN EQ
      if(player.eq[item]){
        if(isSet(player.eq[item].amount)){
          playerItemsLength += player.eq[item].amount;
        }else{
          playerItemsLength++;
        }
      }
      // COUNT ITEMS IN CAPABLEITEMS [backpack]
      const countInBackPackItems = (item) => {
        if(isSet(item.in)){
          for(const inItem of item.in){
            if(inItem){
              if(isSet(inItem.amount)){
                playerItemsLength += inItem.amount;
              }else{
                playerItemsLength++;
              }      
              // playerItemsLength++;
              countInBackPackItems(inItem);
            }
          }
        }  
      }
      countInBackPackItems(player.eq[item])
      // console.log(playerItemsLength)

      // if(isSet(player.eq[item].in)){
      //   for(const inItem of player.eq[item].in){
      //     if(inItem){
      //       playerItemsLength++;
      //     }
      //   }
      // }
    }
    if(isSet(player.itemsLength)){
      // CHECK IF SOMETHING CHANGED IN ITEMS 
      if(player.itemsLength != playerItemsLength){
        this.mainMenu.capableItems.refresh();
        player.itemsLength = playerItemsLength;
        // console.log(playerItemsLength);
      }
    }else{
      player.itemsLength = playerItemsLength;
    }

    // DEPO LOCKERS LISTENING
    if(player.lockerOpened){
      let isLockerOpen = false;
      this.mainMenu.capableItems.opened.forEach((obj)=>{
        if(obj.name == "Locker"){
          isLockerOpen = true;
        }
      })
      if(!isLockerOpen){
        player.lockerDOM = player.locker;
        this.mainMenu.capableItems.open(player.lockerDOM);
      }

    }else{
      this.mainMenu.capableItems.opened.forEach((obj,key)=>{
        if(obj.name == "Locker"){
          this.mainMenu.capableItems.close(player.lockerDOM);
        }
      })
    }
  }
}