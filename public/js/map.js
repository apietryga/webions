/*HEY,
  Here's the map config file.
  Map tamplate look like this: 
  [
    {
      "[0,0]":[      // SECTOR [x,y]
        {
          "0":       // FLOOR [z] (level)
          [
            [1, 9, 1, "floors"],    // [x, y, texture, type]
            [2, 6, 1, "stairs", [1, 4, 1]], // [x, y, texture, type, positionAfterStepOn]
          ]
        }
      ]
    }
  ]*/
let fs,func,stringify;
if(typeof window == "undefined"){fs = require("fs");func = require("./functions");stringify = require("json-stringify-pretty-compact");}
class Map{
  constructor(){
    this.path = "./json/newmap.json";
    // this.path = "./json/testmap.json";
    this.avalibleGrids = ['floors','halffloors'];
    this.notAvalibleGrids = ['walls','stairs','windows'];
    this.template = [];
    this.grids = [];
    this.sprites = [];
    this.maxFloor = 0;
    this.minFloor = 0;
    this.visibleFloor = 0;
    if(typeof window != "undefined"){
    // client side
      let protocol;(window.location.protocol == "https:")?protocol = "wss:":protocol = "ws:";
      this.ws = new WebSocket(protocol+"//"+window.location.host+"/get",'echo-protocol');
      this.ws.onopen = () => {
        this.load(()=>{})  
      }  
    }else{
    // server side
      this.loadServ();
    }
  }
  setMinMaxFloor(){
    for(const sector of this.template){
      for(const floors of sector.floors){
        const floor = Object.keys(floors)[0];
        if(floor*1 > this.maxFloor){this.maxFloor = floor*1;}
        if(floor*1 < this.minFloor){this.minFloor = floor*1;}
      }
    }
    this.visibleFloor = this.maxFloor;
  }
  loadServ(){
    const c = fs.readFileSync(this.path);
    this.template = JSON.parse(c);
    this.setMinMaxFloor();
  }
  load(callback){
    this.loadSprites(()=>{
      const dom = document.querySelector(".loadDetails");
      (dom == null)?'':dom.innerHTML = "Load map...";
      this.ws.send(JSON.stringify({"get":"map"}))
      this.ws.onmessage = (mess) => {
        const dt = JSON.parse(mess.data);
        this.template = dt;
        this.setMinMaxFloor();
        callback(dt);
      }
    });

  }
  generate(callback){
    this.update();
    callback();
  }
  draw(){
    for(const g of this.grids){
      g.draw();
    }
  }
  update([x,y,z] = [0,0,0],how = 'default'){ // player x y z - update all grids in player Area.
    this.grids = [];
    const minY = (how == 'default')?y-6:y-10;
    const minX = (how == 'default')?x-6:x-10;
    const maxX = (how == 'default')?14:21;
    const maxY = (how == 'default')?14:21;
    for(let nZ = -1; nZ <= z; nZ++){
      for(let nX = 0; nX < maxX; nX++){
        for(let nY = 0; nY < maxY; nY++){
          const gridCheck = this.getGrid([(nX+minX),(nY+minY),nZ]);
          if(gridCheck){
            for(const g of gridCheck){this.grids.push(new Grid(g));}
          }
        }
      }
    }
  }
  getGrid([x,y,z],how = "default"){ // how? default | 4editor
    let grid = false;
    const resultArr = [];
    const sector = [Math.floor(x/10),Math.floor(y/10)];
    for(const t of this.template){
      if((typeof window == "undefined")?func.compareTables(t.sector,sector):compareTables(t.sector,sector)){
        for(const gridArr of t.floors){
          const floor = Object.keys(gridArr);
          for(const oneGrid of gridArr[floor[0]]){
            if(oneGrid[0] == x && oneGrid[1] == y 
              // && (floor[0] == z || z == 'all')
            ){
              if(how == "default" && (floor[0] == z )){
                // in order : sprite, x, y, z, type
                grid = [oneGrid[2],oneGrid[0],oneGrid[1],floor[0],oneGrid[3]];
                if(typeof oneGrid[4] != "undefined"){grid.push(oneGrid[4])}
                if(oneGrid[4] == "doors"){
                  console.log(oneGrid);
                }

                if(typeof oneGrid[5] != "undefined"){grid.push(oneGrid[5]);console.log(oneGrid[5])}
                
                // return grid;
                resultArr.push(grid);
              }
              // for adding and deleting 
              if(how == "4editor" && floor[0] == z){
                // in order : x, y, sprite, type [goToPos if isset]
                grid = [oneGrid[0],oneGrid[1],oneGrid[2],oneGrid[3]];
                if(typeof oneGrid[4] != "undefined"){grid.push(oneGrid[4])}
                // in order : z, x, y, type, ??
                return grid;
              }            
            }
          }
        }
      }
    }
    // return grid;
    return resultArr;
  }
  push(callback){
    const valToSend = {
      "get":"pushmap",
      "value": this.newGrid
    }
    this.ws.send(JSON.stringify(valToSend)); 
    this.ws.onmessage = (mess) => {
      callback(JSON.parse(mess.data));
    }
  }
  loadSprites(callback) {
    let loadQuene = [];
    for(const s of sprites){
      loadQuene.push(s.name);
      this.sprites[s.name] = document.createElement("img");
      this.sprites[s.name].src = s.src;
      if(typeof s.w != "undefined"){this.sprites[s.name].dataset.w = s.w;}
      this.sprites[s.name].onload = () => {
        // if(s.name == "male_oriental"){
          // console.log("MALE ORIENTAL");
          // console.log(this.sprites[s.name]);
          // this.sprites[s.name] = recolorImage(this.sprites[s.name],255,255,255,0,0,0);
        // }
        loadQuene.splice(loadQuene.indexOf(s.name),1);
        if(loadQuene.length == 0){
          callback();
        }
      }
    }
    
    

  }
  saveToFileMap(mapPatch,param){
    const mapRead = fs.readFileSync(mapPatch,{encoding:'utf8'});
    const mapArr = JSON.parse(mapRead);
    const pushSector = [Math.floor(param.value[1]/10),Math.floor(param.value[2]/10)];
    const paramv = param.value;
    // find field and delete it if isset (if element is not transparent).
    const issetGrid = this.getGrid([paramv[1],paramv[2],paramv[0]],"4editor")[0];
    // if((paramv[4] != "halffloors"||paramv[4] != "walls") && issetGrid){
    //   for(const m of mapArr){
    //     if(func.compareTables(m.sector,pushSector)){
    //       const floor = Object.keys(m.floors[paramv[0]]);
    //       m.floors[paramv[0]][floor].splice(func.indexOfArr(m.floors[paramv[0]][floor],issetGrid),1);
    //       break;
    //     }
    //   }
          
    // } 
    if(paramv[4] != 'delete'){
      // adding elements
      // param.value = [z , x , y , sprite, type]
      const pushVal = [param.value[1],param.value[2],param.value[3],param.value[4]];
      if(typeof param.value[5] != "undefined"){
        pushVal.push(param.value[5]);
      }
      if(param.value[4] == "stairs"){
        // for north stairs (1)
        if(param.value[3] == 1){
          pushVal.push([param.value[1]-1,param.value[2]-2,param.value[0]+1]);
        }
        // for west stairs (2)
        if(param.value[3] == 2){
          pushVal.push([param.value[1]-2,param.value[2]-1,param.value[0]+1]);
        }
        // for east stairs(3)
        if(param.value[3] == 3){
          pushVal.push([param.value[1]+1,param.value[2]-1,param.value[0]+1]);
        }
        // for south stairs(4)
        if(param.value[3] == 4){
          pushVal.push([param.value[1]-1,param.value[2]+1,param.value[0]+1]);
        }
      }
      let isSector = false;
      let isFloor = false;
      for(const ma of mapArr){
        if(func.compareTables(ma.sector,pushSector)){
          isSector = true;
          for(const v of ma.floors){
            const k = Object.keys(v);
            if(k[0] == param.value[0]){
              v[k[0]].push(pushVal);
              isFloor = true;
              break;
            }
          }
          if(!isFloor){
            ma.floors.push({[param.value[0]]:[pushVal]});
          }
          break;
        }
      }
      if(!isSector){
        // make new sector and push it.
        const newSector = {
          "sector":pushSector,
          "floors":[
            {
              [param.value[0]]:[pushVal]
            }
          ]
        }
        mapArr.push(newSector);
      }
    }      
    const mapString = stringify(mapArr,null,2);
    fs.writeFileSync(mapPatch,mapString);
    this.loadServ();
    return mapString;
  }
}
if(typeof window == "undefined"){module.exports = Map;}