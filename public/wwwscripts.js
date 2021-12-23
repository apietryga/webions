// CONFIG VALS
const map = new Map();
const main = document.querySelector("main");
const searchToObject = () => {
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
const searchObj = isSet(searchToObject().page) ? searchToObject(): { page: 'index' } ;

// dispay searched page
if(document.querySelector("."+searchObj.page)!= null){
  document.querySelector("."+searchObj.page).style.display = "block";
}

// PLAYERS
if(typeof main != null && typeof playersList != "undefined"){
  const dt = (typeof playersList == "string")?JSON.parse(playersList):playersList;
  if(typeof dt.length != "undefined"){
    const params = searchToObject();
    const h1 = document.createElement("h1");
    const table = document.createElement("table");
    main.append(h1);
    main.append(table);
    // PLAYER DETAILS
    const dToShow = [
      "speed",
      "sprite",
      "health",
      "mana",
      "eq",
      "skills",
      "quests",
      "lastDeaths",
      "lastFrame"
    ];
    const skillsToNotShow = [
      "dist_summary",
      "fist_summary"
    ];
    // display single player
    if(Object.keys(params).includes("player")){
      // const backer = document.createElement("a");
      // backer.onclick = () => {window.history.back()};
      // backer.innerHTML="< BACK";
      // main.prepend(backer);
      // get player
      let player = false;
      for(const plr of dt){
        if(plr.name == params.player){
          player = plr;
          break;
        }
      }
      if(player){
        h1.innerHTML = "<a href='/players.html?skills=level'>Players</a> ▸ " + player.name;
        const data = [];
        player.type = "player";
        setTotalVals(player);
        for(const s of Object.keys(player)){if(dToShow.includes(s)){
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
                  // draw else elements xD
                  ctx.drawImage(
                    img, 260, 100, 80, 80,
                    0, 0, 80, 80
                  );
                  ctx.drawImage(
                    img, 20, 100, 80, 80,
                    0, 0, 80, 80
                  );
                }
              }
              td2.append(canvasSprite);
            }else if(s == "lastFrame"){
              order = 2;
              const currentDate = new Date().getTime();
              const lf = new Date(player.lastFrame);
              const frameToString = (lf.getDate()<10?'0':'')+lf.getDate()+"."+((lf.getMonth()+1)<10?'0':'')+(lf.getMonth()+1)+"."+lf.getFullYear()+", "+(lf.getHours()<10?'0':'')+lf.getHours()+":"+(lf.getMinutes()<10?'0':'')+lf.getMinutes();
              if(currentDate - lf < 3000){
                td2.innerHTML = "<span style='color:#fff;'>Online now</span>";
              }else{
                td2.innerHTML = "<span>"+frameToString+"</span>";
              }
            }else if(s == "health"){
              order = 1;
              const healthBar = document.createElement("div");
              healthBar.className = "healthBar";
              const healthProgress = document.createElement("div");
              const progress = (player.health*100)/player.totalHealth;
              healthProgress.style.width = progress+"%";
              healthProgress.style.backgroundColor = hpColor(progress);
              const label = document.createElement("div");
              label.className = "label";
              label.innerHTML = Math.round(player.health)+"&nbsp;/&nbsp;<b>"+Math.round(player.totalHealth)+"</b>&nbsp;";
              label.innerHTML += "("+Math.round(player.maxHealth)+" + "+Math.round(player.totalHealth - player.maxHealth)+")";
              healthBar.append(healthProgress);
              healthBar.append(label);
              td2.append(healthBar);
            }else if(s == "mana"){
              order = 1;
              const manaBar = document.createElement("div");
              manaBar.className = "manaBar";
              const manaProgress = document.createElement("div");
              const progress = (player.mana*100)/player.totalMana;
              manaProgress.style.width = progress+"%";
              manaProgress.style.backgroundColor = "#0c3181";
              const label = document.createElement("div");
              label.className = "label";
              label.innerHTML = Math.round(player.mana)+"&nbsp;/&nbsp;<b>"+Math.round(player.totalMana)+"</b>&nbsp;";
              label.innerHTML += "("+Math.round(player.maxMana)+" + "+Math.round(player.totalMana - player.maxMana)+")";
              manaBar.append(manaProgress);
              manaBar.append(label);
              td2.append(manaBar);
            }else if(s == "eq"){
              order = 3;
              td2.className = "eq";
              const allFields = document.createElement("div");
              allFields.className = "allFields";
              for(const eqField of Object.keys(player.eq)){
                // make field
                const fieldDOM = document.createElement("div");
                fieldDOM.style.gridArea = eqField;
                allFields.append(fieldDOM);
                // fill it by items
                if(player.eq[eqField]){
                  map.loadSprites((val)=>{
                    const item = new Item(player.eq[eqField]);
                    const itemDOM = item.toDOM();
                    fieldDOM.append(itemDOM);
                  })
                }
              }
              td2.append(allFields);
            }else if(s == "skills"){
              order = 4;
              const skillsTbl = document.createElement("table");
              for(const k of Object.keys(player.skills)){
                if(!skillsToNotShow.includes(k)){
                  const sTr = document.createElement("tr");
                  const sTd1 = document.createElement("td");
                  const sTd2 = document.createElement("td");
                  sTd1.innerHTML = k;
                  const totalThis = player['total'+capitalizeFirstLetter(k)];
                  sTd2.innerHTML = "";
                  if(isSet(totalThis)){
                    sTd2.innerHTML += "<b>"+Math.round(totalThis)+"</b> ( ";
                  }
                  sTd2.innerHTML += Math.round(player.skills[k]);
                  if(isSet(totalThis)){
                    sTd2.innerHTML += " <i>+"+Math.round(totalThis - player.skills[k])+"</i> )";
                  }

                  sTr.append(sTd1);
                  sTr.append(sTd2);
                  skillsTbl.append(sTr);
                }
              }
              td2.append(skillsTbl);
            }else if(s == "speed"){
              player.skills.speed = player.speed;
              continue;
            }else if(s == "quests"){
              if(player.name == "GM"){continue;}
              if(player.quests.length == 0 || player.quests.constructor != Array){continue;}
              order = 4;
              td2.className = "quests";
              for(const quest of player.quests){
                const questsDOM = document.createElement("div");
                // questsDOM.className = "quests";
                questsDOM.innerHTML = quest+" Quest";
                td2.append(questsDOM);
              }
            }else if(s == "lastDeaths" && isSet(player.lastDeaths)){
              if(!isSet(player.lastDeaths[1]) && isSet(player.lastDeaths[0])){
                player.lastDeaths = [player.lastDeaths[0]];
              }
              if(player.lastDeaths.length == 0){continue;}
              order = 5;
              const table = document.createElement("table");
              for(const death of player.lastDeaths.reverse()){
                const row = document.createElement("tr");
                const tdx1 = document.createElement("td");
                let when = death.when.split(/[T,.]+/);
                tdx1.innerHTML = when[0].replaceAll("-",".");
                tdx1.innerHTML += "<br /><sub>"+when[1].slice(0,5)+"</sub>";
                const tdx2 = document.createElement("td");
                tdx2.innerHTML += "By ";     
                if(death.whoType == "player"){
                  tdx2.innerHTML += "<a href='/players.html?player="+death.who+"'>"+death.who+"</a>";
                }else{
                  tdx2.innerHTML += death.who;
                }
                tdx2.innerHTML += " on "+death.level+" level.";     
                row.append(tdx1);
                row.append(tdx2);
                table.append(row);
              }
              td2.append(table);
            }
            tr.append(td1);
            tr.append(td2);          
            data.push([order,tr])
        }}
        // append doms in order
        data.sort();
        for(const d of data){
          table.append(d[1]);
        }
      }else{
        h1.innerHTML = "Player not found. <br /><a href='players.html'>Look at exists players.</a>"
        table.remove();
      }
    }else if(Object.keys(params).includes("lastdeaths")){
    // LAST DEATHS  
      h1.remove();
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
        td1.innerHTML = when[0].replaceAll("-",".")+", "+when[1].slice(0,5);
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
    }else{
      // SKILLS && PLAYERS & ONLINE LIST 
      const tbHead = ["lp.","Player name","level"];
      if(typeof skills != "undefined"){
        tbHead[2] = "SKILLS";
      }
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
        if(d.name != "GM" && isSet(d.skills)){
          sorted.push([d.skills[key],d]);
        }
      }
      sorted.sort((a,b)=>{
        if(a[0] < b[0]){return 1;}
        if(a[0] > b[0]){return -1;}
        return 0;
      });
      // Display message when is no players
      if(sorted.length < 1){
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.innerHTML = "No one.";
        td.colSpan = 3;
        td.style.padding = "10px";
        tr.append(td);
        table.append(tr);
      }
      // make players list in order of key
      for(const [i,playerSort] of sorted.entries()){
        const player = playerSort[1];
        const tr = document.createElement("tr");
        tr.className = "listBody";
        tr.dataset.href = "players.html?player="+player.name;
        tr.onclick = () => { window.location = tr.dataset.href;} 

        const tds = [i+1,player.name];
        if(typeof key != "undefined" && typeof player.skills[key] != "undefined"){
          tds.push(player.skills[key]);
        }else{
          tds.push(player.skills.level)
        }
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

// LIBARY
if('/libary.html' == location.pathname){
  const pureInfo = [];
  const dom = document.querySelector(".content");
  if(dom!=null){
    dom.className += " "+searchObj.page;
  }
  const table = document.createElement("table"); 

  // DISPLAY SEARCHED PAGE
  document.querySelector("."+searchObj.page).style.display = "block";
  if(searchObj.page != "index"){
    document.querySelector("h1").append(" ▸ "+capitalizeFirstLetter(searchObj.page))
  }
  
  // Scrollbars top and bottom of table
  const d1 = document.createElement("div");
  const wrp1 = document.createElement("div");
  wrp1.style.display = "none";
  const d2 = document.createElement("div");
  const setTopScrollBar = (e) => {
    const tblWidth = getComputedStyle(table).width;
    d1.style.width = tblWidth;
    if(d2.scrollWidth > 0){
      wrp1.style.display = "block";
    }else{
      wrp1.style.display = "none";
    }
  }; 
  const wrp2 = document.createElement("div");
  wrp1.className = "scrollWrapper";
  wrp2.className = "scrollWrapper";
  d1.style.height = "1px";
  d2.append(table);
  wrp1.onscroll = () => {wrp2.scrollLeft = wrp1.scrollLeft}
  wrp2.onscroll = () => {wrp1.scrollLeft = wrp2.scrollLeft}
  window.onresize = (e) => {setTopScrollBar(e);}
  dom.append(wrp1);
  dom.append(wrp2);
  wrp1.append(d1);
  wrp2.append(d2);  
  const elementSprite = {};
  let sortOrder = 1;
  const fillTableWithContent = () => {
    if(table.querySelector('tbody') != null){table.querySelector('tbody').remove();}
    const tbody = document.createElement("tbody"); table.append(tbody);
    for(const element of pureInfo){
      const tr = document.createElement("tr"); tbody.append(tr);
      if(isSet(element.desc)){
        const td0 = document.createElement('td'); tr.append(td0);
        td0.className = "sprite";
        td0.dataset.sprite = element.sprite;
        td0.dataset.name = element.name;
        if(isSet(element['spriteNr'])){td0.dataset.spriteNr = element['spriteNr'];}
        if(Object.keys(elementSprite).length > 0){
          td0.append(elementSprite[element.name]);
        }
        const td1 = document.createElement('td'); tr.append(td1);
        td1.innerHTML = element.name;
        const td2 = document.createElement('td'); tr.append(td2);
        td2.innerHTML = "<div>"+element.desc+"</div>";
        td2.colSpan = tableKeys.length-1;
      }else{
        for(const templateKey of tableKeys){
          const td = document.createElement('td'); tr.append(td);
          if(templateKey == "sprite"){
            td.className = "sprite";
            td.dataset.sprite = element[templateKey];
            td.dataset.name = element.name;
            if(isSet(element['spriteNr'])){td.dataset.spriteNr = element['spriteNr'];}
            if(Object.keys(elementSprite).length > 0){
              td.append(elementSprite[element.name]);
            }
          }else{
            td.innerHTML = isSet(element[templateKey]) && element[templateKey] ? element[templateKey] : '-' ;
          }
        }
      }
    }
  }
  const tableKeys = [];
  const jsToTable = (type) =>{
    const notDisplayingItems = ["staticBox","backpack","coins"];
    const typename = Object.keys(type);
    if(dom != null){
      // GET PURE INFO ARRAY
      for(const element of type[typename]){
        // exceptions
        if(notDisplayingItems.includes(element.name)){continue;}
        if(!element.pickable && element.type == "item"){continue;} 
        const notDisplayingKeys = ["amount","handle","pickable","walkThrow"];
        const notTHkeys = ['desc', 'spriteNr','skills'];
        const pureInfoElement = {};
        for(const key of Object.keys(element)){
          if(!notDisplayingKeys.includes(key)){
            if(key == "randStats"){
              for(const randStats of element[key]){
                pureInfoElement[Object.keys(randStats)] = randStats[Object.keys(randStats)];
              }
            }else if(key == "skills"){
              for(const skill of Object.keys(element[key])){
                pureInfoElement[skill] = element[key][skill];
                if(!notTHkeys.includes(skill) && !tableKeys.includes(skill)){tableKeys.push(skill)};
              }
            }else{
              if(!notTHkeys.includes(key) && !tableKeys.includes(key)){tableKeys.push(key)};
              pureInfoElement[key] = element[key];
            }
          }
        }
        pureInfo.push(pureInfoElement);
      }
      // SORT TABLEKEYS 
      tableKeys.sort((a,b)=>{
        // sprite first
        if(a == "sprite"){return -1;}if(b == "sprite"){return 1;}
  
      })
      // MAKE TABLE FROM PUREINFO
      const thead = document.createElement("thead"); table.append(thead);
      const doNotDisplayText = ['sprite'];
      for(const key of tableKeys){
        const th = document.createElement("th"); thead.append(th);
        th.className = searchObj.page;
        th.onclick = () => {
          sortOrder = sortOrder == 1 ? -1 : 1;
          pureInfo.sort((a,b) => {
            let result = -1;
            let aKey = !isSet(a[key]) || ["-",''].includes(a[key]) ? 0 : a[key] ;
            let bKey = !isSet(b[key]) || ["-",''].includes(b[key]) ? 0 : b[key];
            aKey = typeof aKey == "string" ? aKey.split("-")[1]*1 : aKey;
            bKey = typeof bKey == "string" ? bKey.split("-")[1]*1 : bKey;
            if(sortOrder == 1){
              if(aKey > bKey){result = 1;}
              if(aKey < bKey){result = -1;}
            }else{
              if(aKey < bKey){result = 1;}
              if(aKey > bKey){result = -1;}
            }
            return result;
          })
          fillTableWithContent();
        }
        if(doNotDisplayText.includes(key)){continue;}
        th.append(sign.render(key));
      }
      fillTableWithContent();
    }
    setTopScrollBar();
  }
  if(isSet(items) && searchObj.page == "items"){jsToTable({items});}
  if(isSet(monsters) && searchObj.page == "monsters"){jsToTable({monsters});}
  // SPRITES LOADER
  map.loadSprites(()=>{
  // DISPLAY SPRITES
  // console.log(sprites)
    for(const spriteField of document.querySelectorAll(".sprite")){
      const element = spriteField.dataset;
      // console.log(sprites);
      // console.log(element)
      for(const sprite of sprites){
        if(sprite.name == element.sprite){
          const ab = map.sprites[element.sprite].height;
          const w = map.sprites[element.sprite].width;
          const img = document.createElement("div");
          img.style.height = ((ab)/5)+"px";
          img.style.backgroundImage = "url("+sprite.src+")";
          if(typeof element.spriteNr != "undefined"){
            hw = 40;
            img.className = "item preview"
            img.style.backgroundPosition = "-"+(hw*element.spriteNr)+"px 0px";
            img.style.backgroundSize = ((hw)*(w/(ab)))+"px 100%";
            img.style.width = hw+"px";
            img.style.height = hw+"px";
          }else{
            img.className = "monster preview"
            img.style.width = (ab/5)+"px";
            img.style.height = (ab/5)+"px";
            img.style.backgroundPosition = (3*(ab)/5)+"px -"+(1*(ab)/5)+"px";
          }
          spriteField.append(img);
          elementSprite[element.name] = img;
          break;
        }
        // console.log(elementSprite);
      }
    }
  })
}