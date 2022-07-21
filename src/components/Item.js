const GameMap = require("../../public/js/map");
const map = new GameMap();
const func = require("../../public/js/functions");
const game = require("../../public/js/gameDetails");
const itemsTypes = require("../types/itemsTypes").types;



class Item{
  constructor(obj){
    this.rewrite(obj);
  }
  makeNew(obj,items,creature){
    const item = new Item(obj);
    // GENERATE RANDOM STATS:
    if(func.isSet(item.randStats)){
      // let x;
      for(const randStat of item.randStats){
        // 50% chance of display this stat
        if(Math.round(Math.random())){
          const key = Object.keys(randStat)[0];
          const [min, max] = randStat[key].split("-");
          const value = min*1 + Math.floor(Math.random() * max);
          if(value > 0){
            item[key] = value;
          }       
        }
      }
    }
    if((func.isSet(creature.boxExhoust) && creature.boxExhoust <= game.time.getTime()) || !func.isSet(creature.boxExhoust)){
      let setted = false;
      let f; // key of eq item
      // check empty places in eq
      if(func.isSet(item.handle)){
        for(f of item.handle){
          if(!creature.eq[f]){
            setted=true;
            break;
          }
        }
      }
      // check player quests
      let isQuest = false;
      for(const quest of creature.quests){
        if(quest == item.name){
          isQuest = true;
          break;
        }        
      }
      // display result
      if(isQuest && creature.name != "GM"){
        creature.text = "The box is empty.";
      }else if(!setted){
        item.relocate(creature, items, { actionType: 'pickUp', brandNew: true })
        creature.quests.push(item.name)
      }else{
        creature.text = "You've found a " + item.name;
        creature.quests.push(item.name)
        creature.eq[f] = item;
      }
      // set exhaust on box
      creature.boxExhoust = game.time.getTime() + 1000;
    }
  }
  relocate(creature,items,itemAction){
    // EQ TO MAP
    if(itemAction.actionType == 'drop'){
      // DROP ITEM
      if(func.isSet(itemAction.field) && itemAction.field != "" ){
        // SET DROPPING FLOOR [WHEN DROP IS BETWEEN FLOORS]
        if(func.isPos(map,this)){
          let isInField = false;
          if(this.field.includes(",")){
            // DELETE ITEM FROM BACKPACK
            let parentCapable;
            parentCapable = creature.eq[this.field.split(",")[0]];
            for(let inLevel = 0; inLevel < this.field.split(",").length; inLevel++){
              if(inLevel && inLevel < this.field.split(",").length - 1){
                parentCapable = parentCapable.in[this.field.split(",")[inLevel]];
              }
            }         
            if(parentCapable){
              const index = this.field.split(",")[this.field.split(",").length - 1 ];
              parentCapable.in.splice(index,1)
              isInField = true;
            }
          }else{
            // DELETE ITEM FROM EQ FIELDS
            for(const field of Object.keys(creature.eq)){
              if(field == this.field){
                isInField = true;
                // delete it from eq
                creature.eq[this.field] = false;
                break;
              }
            }
          }
          if(isInField){
            // ADD IT TO MAP
            items.allItems.push(this);
            creature.text = "You dropped out a "+this.name+".";
          }else{
            creature.text = "Sorry, it not possible. [e1]";
          }
        }else{
          creature.text = "Sorry, it not possible. [e2]";
        }
      }else if( itemAction.field == ""){
          // ADD IT TO MAP
          items.allItems.push(this);
          creature.text = "You dropped out a "+this.name+".";
      }else{
        creature.text = "You can't drop this out.";
      }
    }
    // MAP TO EQ OR BP
    if(itemAction.actionType == 'pickUp'){
      if(this.pickable){
        let move = false;
        // GROUP AMOUNT ITEMS
        if(func.isSet(this.amount) && func.searchItemInCreature(this, creature)){
          move = true;
        }else{
          // TRY TO MOVE ITEM TO EQ
          for(const handle of this.handle){
            if(!creature.eq[handle]){
              move = true;
              creature.eq[handle] = this;
              break;
            }
          }
          // IF EQ IS FULL, TRY MOVE IT TO BP
          if(!move && creature.eq.bp){
            
            
            if(!func.isSet(creature.eq.bp.in)){creature.eq.bp.in = [];}
            // check fields in bp
            if(creature.eq.bp.in.length < creature.eq.bp.cap){
              creature.eq.bp.in.push(this);
              move = true;
            }


          }
        }
        // SHOW RESULT
        if(!move){
          creature.text = "You can't pick up this "+this.name;
        }else if(func.isSet(itemAction.brandNew)){
          creature.text = "You've found a "+this.name;
        }else{
          creature.text = "You picked up "+this.name;
          // clear it from itemlist
          this.delete = true;
          // to last dropped on top
          items.allItems.reverse();
          items.allItems.splice(items.allItems.map((e)=>{ 
            if(func.isSet(this.position) && func.compareTables(e.position, this.position)){
              e.delete = true;
              return this.delete
            }else{
              return 0;
            }
          }).indexOf(this.delete),1);
          // reverse it as at begin.
          items.allItems.reverse();
          delete this.delete;
        }
      }else{
        creature.text = "You can't take this item."
      }
    }
  }
  rewrite(obj){
    if(func.isSet(obj)){
      // MAKE WITH OBJ
      for(const key of Object.keys(obj)){
        this[key] = obj[key];
      }  
      // UPDATE IT FROM PROPERTIES FROM ITEMS TYPES
      for(const it of itemsTypes){
        if(func.isSet(obj.name) && obj.name == it.name){
          for(const key of Object.keys(it)){
            if(!func.isSet(this[key])){
              this[key] = it[key];
            }
          }
        }
      }
      // FILL ID IF IS NOT
      // if(!func.isSet(this.id)){
      //   this.id = itemID++;
      // }
    }
  }
}
module.exports = Item;