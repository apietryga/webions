interface Functions {
  setTotalVals: Function,
  validateNick: Function,
}

const functions: Functions = {

  setTotalVals: (where: any) => {
    where.totalHealth = where.maxHealth;
    if(where.type == "player"){
      where.totalSpeed = where.speed;
      where.totalDef = where.skills?.def;
      where.totalFist = where.skills?.fist;
      where.totalDist = where.skills?.dist;
      where.totalMana = where.maxMana;
      where.totalManaRegen = where.manaRegenValue;
      // if(this.isSet(where.eq)){
      if(where?.eq){
        for(const key of Object.keys(where.eq)){
          if(where.eq[key]){
            if(where?.eq[key].speed){where.totalSpeed += where.eq[key].speed;}
            if(where?.eq[key].def){where.totalDef += where.eq[key].def;}
            if(where?.eq[key].health){where.totalHealth += where.eq[key].health;}
            if(where?.eq[key].mana){where.totalMana += where.eq[key].mana;}
            if(where?.eq[key].manaRegen){where.totalManaRegen += where.eq[key].manaRegen;}
            if(where?.eq[key].fist){where.totalFist += where.eq[key].fist;}
            if(where?.eq[key].dist){where.totalDist += where.eq[key].dist;}
          }
        }
      }
    }
  },

  validateNick: (nick: string, forbiddenNicks: Array<string>) => {
    if(nick.split("+").length > 2){
      nick = nick.replace(/[+]/g, ' ');
    }else{
      nick = nick.replace('+',' ');
    }
    if(/\d/.test(nick)){return [false, 'Nick cannot contains numbers']}
    if(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(nick)){return [false, 'Nick contains illegal chars']}
    for(const fNick of forbiddenNicks){
      if(fNick == nick){
        return [false,"This nickname is forbidden"];
      }
    }  
    return [true, nick];
  },

}

export default functions