let protocol;(window.location.protocol == "https:")?protocol = "wss:":protocol = "ws:";
const ws = new WebSocket(protocol+"//"+window.location.host+"/get",'echo-protocol');
ws.onopen = (dt) =>{ws.send(JSON.stringify({"get":"playersList"}));}
ws.onmessage = (mess) => {
  const dt = JSON.parse(JSON.parse(mess.data));
  const params = searchToObject();
  const main = document.querySelector("main");
  const h1 = document.createElement("h1");
  const table = document.createElement("table");
  main.append(h1);
  main.append(table);
  if(Object.keys(params).includes("player")){ // PLAYER DETAILS
    const backer = document.createElement("a");
    backer.href = "./players.html";
    backer.innerHTML="< GO BACK";
    main.prepend(backer);
  
    let player = false;
    for(const plr of dt){
      if(plr.name == params.player){
        player = plr;
        break;
      }
    }
    if(player){
      h1.innerHTML = player.name;
      const dToShow = [
        "speed",
        "sprite",
        "health",
        "skills"
      ];
      const data = [];
      for(const s of Object.keys(player)){
        if(dToShow.includes(s)){
          let order = 0;
          const tr = document.createElement("tr");
          tr.className = "detailsBody";
          const td1 = document.createElement("td");
          const td2 = document.createElement("td");
          td1.innerHTML = s;
          if(s == "sprite"){
            order = 2;
            const spriteWrapper = document.createElement("div");
            spriteWrapper.className = "spriteWrapper";
            const sprite = document.createElement("div");
            sprite.className = "sprite";
            sprite.style.backgroundImage = "url(../img/sprites/"+player.sprite+".webp)";
            spriteWrapper.append(sprite);
            td2.append(spriteWrapper);
          }else if(s == "health"){
            order = 1;
            const healthBar = document.createElement("div");
            healthBar.className = "healthBar";
            const healthProgress = document.createElement("div");
            const progress = (player.health*100)/player.maxHealth;
            healthProgress.style.width = progress+"%";
            healthProgress.style.backgroundColor = "green";
            const label = document.createElement("div");
            label.innerHTML = player.health+" / "+player.maxHealth;
            healthBar.append(healthProgress);
            healthBar.append(label);
            td2.append(healthBar);
          }else if(s == "skills"){
            order = 4;
            const skillsTbl = document.createElement("table");
            for(const k of Object.keys(player.skills)){
              const sTr = document.createElement("tr");
              const sTd1 = document.createElement("td");
              const sTd2 = document.createElement("td");

              sTd1.innerHTML = k;
              sTd2.innerHTML = player.skills[k];

              sTr.append(sTd1);
              sTr.append(sTd2);
              skillsTbl.append(sTr);
            }
            td2.append(skillsTbl);
          }else if(s == "speed"){
            player.skills.speed = player[s];
            continue;
          }else{
            order = 3;
            td2.innerHTML = player[s];
          }
          tr.append(td1);
          tr.append(td2);          
          data.push([order,tr])
        }
      }
      // append doms in order
      data.sort();
      for(const d of data){
        table.append(d[1]);
      }

    }else{
      h1.innerHTML = "Player not found. <br /><a href='players.html'>Look at exists players.</a>"
      table.remove();
    }
// sączów
// siemonie

  }else{ // PLAYERS LIST
    h1.innerHTML = "Players list";
    table.innerHTML = "";
    // make table header
    const tbHead = ["lp.","Player name","level"];
    const tr = document.createElement("tr");
    tr.className = "listHead";
    for(const [i,h] of tbHead.entries()){
      const th = document.createElement("th");
      th.innerHTML = h;
      // if(i == 0){th.colSpan=2;}
      tr.append(th)
    }
    table.append(tr);
    const sorted = [];
    for(const d of dt){
      sorted.push([d.skills.level,d]);
    }
    sorted.sort((a,b)=>{
      if(a[0] < b[0]){return 1;}
      if(a[0] > b[0]){return -1;}
      return 0;
    });
    // make players list in order of level
    for(const [i,playerSort] of sorted.entries()){
      const player = playerSort[1];
      const tr = document.createElement("tr");
      tr.className = "listBody";
      tr.dataset.href = "players.html?player="+player.name;
      tr.onclick = () => { window.location = tr.dataset.href;} 
      const tds = [i+1,player.name,player.skills.level];
      for(const t of tds){
        const td = document.createElement("td");
        td.innerHTML = t;
        tr.append(td);
      }
      table.append(tr);
    }
  }
}
function searchToObject() {
  var pairs = window.location.search.substring(1).split("&"),
    obj = {},
    pair,
    i;

  for ( i in pairs ) {
    if ( pairs[i] === "" ) continue;

    pair = pairs[i].split("=");
    obj[ decodeURIComponent( pair[0] ) ] = decodeURIComponent( pair[1] );
  }

  return obj;
}