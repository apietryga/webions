this.types = [
  { name: "staticBox",
    sprite: "action_items",
    spriteNr : 3,
    walkThrow : false,
    walkOn : (creature,item) => {
      if(typeof item.level != "undefined" && item.level > creature.skills.level){
        creature.text = "You need "+item.level+" level to open this box";
      }else if(typeof creature.eq !=  "undefined" && !creature.eq.bp && creature.type == "player"){
        item.makeNew({name:item.inItem},"eq",creature);
        creature.text = "You've found "+item.inItem+".";
      }else{
        creature.text = "This box is empty.";
      }
    },
    pickable:false
  },
  { name: "backpack",
    sprite: "items",
    spriteNr : 0,
    cap:8,
    handle:['bp'],
    pickable:true
  },
  { name: "Rod",
    sprite: "items",
    spriteNr: 1,
    atk: 100,
    handle: ["lh","rh"],
    pickable:true
  },
  { name: "ladder",
    sprite: "action_items",
    spriteNr: 4,
    handle: ["lh","rh"],
    pickable:true
  },
  { name: "Simple Helmet",
    sprite: "items",
    spriteNr: 2,
    handle: ["hd"],
    pickable:true,
    health: 180
  },
  { name: "Simple Armor",
    sprite: "items",
    spriteNr: 3,
    handle: ["ch"],
    pickable:true
  },
  { name: "Simple Legs",
    sprite: "items",
    spriteNr: 4,
    handle: ["lg"],
    pickable:true
  },
  { name: "Simple Boots",
    sprite: "items",
    spriteNr: 5,
    handle: ["ft"],
    pickable:true,
    speed:2
  },
  { name: "The Crown",
    sprite: "items",
    spriteNr: 6,
    handle: ["hd"],
    pickable:true,
    health:1000
  },
  { name: "King's Armor",
    sprite: "items",
    spriteNr: 7,
    handle: ["ch"],
    pickable:true
  },
  { name: "King's Legs",
    sprite: "items",
    spriteNr: 8,
    handle: ["lg"],
    pickable:true
  },
  { name: "King's Boots",
    sprite: "items",
    spriteNr: 9,
    handle: ["ft"],
    pickable:true,
    speed:7
  },
  { name: "Wand of Destiny",
    sprite: "items",
    spriteNr: 10,
    handle: ["lh","rh"],
    pickable:true
  },
  { name: "Simple Shield",
    sprite: "items",
    spriteNr: 11,
    handle: ["lh","rh"],
    pickable:true,
    def:8
  },
  { name: "Blessed Shield",
    sprite: "items",
    spriteNr: 12,
    handle: ["lh","rh"],
    pickable:true
  },
  { name: "coins",
    sprite: "coins",
    spriteNr: 1,
    handle: ["lh","rh"],
    pickable:true,
    amount:10
  },
];