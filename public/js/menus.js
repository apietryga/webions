const menus = {
  gamePlane : document.querySelector(".gamePlane"),
  menus : [
    "outfit",
    "mainButtons"
  ],
  buttons:[],
  init(){
    // CREATING VISIBLE BUTTONS TO OPEN MENUS
    for(const m of this.menus){
      if(document.querySelector("."+m) == null){
        this.buttons[m] = document.createElement("div");
        this.buttons[m].className = m;
        this.gamePlane.append(this.buttons[m]);
        this[m].div = this.buttons[m]; 
        this[m].init(this.buttons[m]);  
      }
      this[m].resize();
    }
    // console.log(this)
  },
  mainButtons:{
    init(){
      // console.log(this.div.style.position = "fixed");
      this.div.style.cssText = `
        position:fixed;
        right:0;
        top:0;
      `;
      const butts = [
        {
          type: "button",
          text: "LOGOUT",
          func: () => {window.location.replace("/account.html?action=logout")}
        },
        {
          type: "button",
          text: "STOP",
          func: () => {gamePlane.stop();}
        }
      ]
      for(const b of butts){
        const e = document.createElement(b.type);
        e.innerHTML = b.text;
        e.onclick = () => { b.func() }
        this.div.append(e);
      }
      // const logout = document.createElement("button");
      // logout.innerHTML = "LOGOUT";
      // logout.onclick = () => { }


      // this.div.append(logout);
    },
    resize(){

    }
  },
  outfit:{
    init(){
      const butt = document.createElement("button");
      butt.innerHTML = "&blacktriangleright;";
      butt.onclick = () => {
        this.close();
        this.show();
      }
      this.div.append(butt);
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
      container.className = "outFitContainter";

      container.style.cssText = `
        position:absolute;
        width:${Math.round(gamePlane.canvas.offsetWidth*0.8)}px;
        border:3px solid #2F2F2F;
        border-top:20px solid #2F2F2F;
        background-color:#5A5A5A;
        color:#fff;
        z-index:2;
      `;menus.gamePlane.append(container);

      const innerContainer = document.createElement("div");
      innerContainer.style.cssText = `
        display:flex;  
        padding:10px;
      `;container.append(innerContainer);

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
      layerPicker.style.cssText = `
        flex:1;
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        padding:0 3px 0 10px;
      `;innerContainer.append(layerPicker);
      this.tools.layerPicker();

      const colorPicker = document.createElement("div");
      colorPicker.className = "colorPicker";
      colorPicker.style.cssText = `
        flex:5;
        display:flex;
      `;innerContainer.append(colorPicker); 
      this.tools.colorPicker();

      canvas.style.height = canvas.offsetWidth+"px";

      const footer = document.createElement("div");
      footer.style.cssText = `
        display:flex;  
        padding:10px;
        padding-top:0;
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
        this.sprites;
        const text = document.createElement("span");
        let sName;
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
              if(this.activeSprite > this.sprites.length){
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
              // console.log(pColor);
            }
            col.append(singleColor);
          }
        }
      }
    },
    close(){
      const oFC = document.querySelector(".outFitContainter");
      if(oFC != null){
        document.querySelector(".outFitContainter").remove();
      }
    }
  }
}