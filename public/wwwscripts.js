let protocol;(window.location.protocol == "https:")?protocol = "wss:":protocol = "ws:";
const ws = new WebSocket(protocol+"//"+window.location.host+"/get",'echo-protocol');
let getWhat;
if(Object.keys(searchToObject()).includes("online")){
  getWhat = "onlineList";
}else{
  getWhat = "playersList";
}
ws.onopen = () =>{ws.send(JSON.stringify({"get":getWhat}));}
ws.onmessage = (mess) => {
  const main = document.querySelector("main");
  main.innerHTML = "LOADING ... ";
  const dt = JSON.parse(mess.data);
  if(typeof dt.length != "undefined"){
    const params = searchToObject();
    const h1 = document.createElement("h1");
    const table = document.createElement("table");
    main.innerHTML = "";
    main.append(h1);
    main.append(table);
    if(Object.keys(params).includes("player")){ // PLAYER DETAILS
      const backer = document.createElement("a");
      // backer.href = "./players.html";
      backer.onclick = () => {window.history.back()};
      backer.innerHTML="< GO BACK";
      main.prepend(backer);
      
      // get player
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
          "skills",
          "lastDeaths"
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
              const canvasSprite = document.createElement("canvas");
              canvasSprite.width = 40;canvasSprite.height = 40;
              const ctx = canvasSprite.getContext("2d");
              let img = new Image();
              img.src = "../img/sprites/outfits/"+player.sprite+".webp";
              img.onload = () => {
                const recolor = recolorImage(img,player.colors);
                recolor.onload = () =>{
                  img = recolor;
                  console.log("LOADED!")
                  // draw else elements xD
                  ctx.drawImage(
                    img, 260, 100, 80, 80,
                    0, 0, 80, 80
                  );
                  ctx.drawImage(
                    img, 20, 100, 80, 80,
                    1, 1, 80, 80
                  );
                }
              }
              td2.append(canvasSprite);
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
            }else if(s == "lastDeaths"){
              order = 5;
              for(const death of player.lastDeaths){
                const row = document.createElement("tr");
                const tdx1 = document.createElement("td");
                const when = death.when.split(/[T,.]+/);
                tdx1.innerHTML = when[0]+" "+when[1];
                const tdx2 = document.createElement("td");
                tdx2.innerHTML += "Killed by ";     
                if(death.whoType == "player"){
                  tdx2.innerHTML += "<a href='/players.html?player="+death.who+"'>"+death.who+"</a>";
                }else{
                  tdx2.innerHTML += death.who;
                }
                tdx2.innerHTML += " on level "+death.level+".";     
                row.append(tdx1);
                row.append(tdx2);
                td2.append(row);
              }
              player.skills.speed = player[s];
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

    }else if(Object.keys(params).includes("lastdeaths")){ // PLAYERS & ONLINE LIST
      h1.innerHTML = "Last Deaths";
      // GET ALL DEATHS
      const allDeaths = [];
      for(const player of dt){
        if(typeof player.lastDeaths != "undefined" && player.lastDeaths.length > 0){
          for(const death of player.lastDeaths){
            death.player = player.name;
            allDeaths.push(death);
          }
        }
      }
      // sort it here
      allDeaths.sort((a,b)=>{
        if(new Date(a.when).getTime() > new Date(b.when).getTime() ){return -1;}
      })
      // display 
      for(const death of allDeaths){
        const row = document.createElement("tr");
        const td1 = document.createElement("td");
        const when = death.when.split(/[T,.]+/);
        td1.innerHTML = when[0]+" "+when[1];
        const td2 = document.createElement("td");
        td2.innerHTML = "<a href='/players.html?player="+death.player+"'>"+death.player+"</a>";
        td2.innerHTML += " was killed by ";     
        if(death.whoType == "player"){
          td2.innerHTML += "<a href='/players.html?player="+death.who+"'>"+death.who+"</a>";
        }else{
          td2.innerHTML += death.who;
        }
        td2.innerHTML += " on level "+death.level+".";     
        row.append(td1);
        row.append(td2);
        table.append(row);
      }
    }else{ // PLAYERS & ONLINE LIST
      if(getWhat == "onlineList"){
        h1.innerHTML = "Online list";
      }else{
        h1.innerHTML = "Players list";
      }

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
      table.innerHTML = "";
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