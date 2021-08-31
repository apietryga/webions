fetch("../json/playersList.json").then((dt)=>dt.json()).then(dt => {
  const params = searchToObject();
  const main = document.querySelector("main");
  const h1 = document.createElement("h1");
  const table = document.createElement("table");
  main.append(h1);
  main.append(table);
  if(Object.keys(params).includes("player")){
    // PLAYER DETAILS
    let player = false;
    for(const plr of dt){
      if(plr.name == params.player){
        player = plr;
        break;
      }
    }
    if(player){
      h1.innerHTML = params.player;
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.className = "sprite";
      const bgImg = document.createElement("div");
      bgImg.style.backgroundImage = "url(../img/sprites/"+player.sprite+".webp)";
      
      td.append(bgImg);
      // td.innerHTML = "XDD";
      // td.rowSpan = 0;
      td.colSpan = 2;
      tr.append(td);
      table.append(tr);
      for(const s of Object.keys(player.skills)){
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        
        td1.innerHTML = s;
        td2.innerHTML = player.skills[s];
        
        tr.append(td1);
        tr.append(td2);
        table.append(tr);
      }
      console.log(player)



    }else{
      h1.innerHTML = "Player not found. <br /><a href='players.html'>Look at exists players.</a>"
      table.remove();
    }
  }else{
    // PLAYERS LIST
    h1.innerHTML = "Players list";
    table.innerHTML = "";
    for(const [i,player] of dt.entries()){
      const a = document.createElement("a");
      a.href = "players.html?player="+player.name;
      const tds = [i+1,player.name,player.skills.exp];
      for(const t of tds){
        const td = document.createElement("td");
        td.innerHTML = t;
        a.append(td);
      }
      table.append(a);
    }
  }
})
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