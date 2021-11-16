const monstersTypes = [
  // npc's
  {name:"Slepo Oma",
    sprite:"oma",
    health:100,
    type:"npc",
    speed:1.3,
    skills:{
      fist:0,
      exp:-50,
      dist:0,
      healing:20
    },
    onWalk:()=>{
      // menus.console("Walk on");
      return says = "Elo"
    },
    dialog:(npc,player) => {
      if(player.says == "hi"){
        if(player.quests.includes("simpleBoots")){
          npc.says = "I have no more quests."
        }else{
          npc.says = "Hi "+player.name+"! \n I have a quest for you! \n Are you interested in?"; 
        }
      }
      if(player.says == "quest"){
        npc.says = "JA, HAHA QUEST?";
      }
    }
  },
  { name:"King",
    type:"npc",
    sprite:"king",
    health:10000000,
    speed:0.8,
    skills:{
      fist:10,
      exp:1,
      dist:0,
      healing:1000
    }

  },

  { name:"Training Man",
  // type:"npc",
    sprite:"trainingMan",
    health:10000000,
    speed:0,
    skills:{
      fist:10,
      exp:1,
      dist:0,
      healing:1000
    }
  },



  // default
  
  {name:"Minotaur",
    sprite:"minotaur",
    health:3000,
    speed:7,
    skills:{
      fist:500,
      exp:500,
      dist:550,
      healing:500
    }
  },
  {name:"Dragon",
    sprite:"dragon",
    health:1800,
    speed:2,
    skills:{
      fist:400,
      exp:100,
      dist:150,
      healing:200
    }
  },
  {name:"Mage",
    sprite:"mmage",
    health:800,
    speed:1,
    skills:{
      fist:25,
      exp:25,
      dist:0
    }
  },
  {name:"Cyclops",
    sprite:"cyclops",
    health:750,
    speed:2.5,
    skills:{
      fist:250,
      exp:50,
      dist:0,
      healing:50
    }
  },
  {name:"Orange Wizard",
    sprite:"orangeWizard",
    health:1700,
    speed:3,
    skills:{
      fist:100,
      exp:70,
      dist:450,
      healing:100
    }
  },
  {name:"Maggot",
    sprite:"maggot",
    health:700,
    speed:2,
    skills:{
      fist:200,
      exp:30,
      dist:0,
      healing:50
    }
  },
  {name:"Cat",
    sprite:"cat",
    health:500,
    speed:1.5,
    skills:{
      fist:0,
      exp:1,
      dist:0
    }
  },
  {name:"Wasp",
    sprite:"wasp",
    health:250,
    speed:1.5,
    skills:{
      fist:50,
      exp:10,
      dist:0
    }
  },

  // leauge 
  {name:"Touret",
    sprite:"tourets",
    health:5000,
    speed:0,
    skills:{
      fist:300,
      exp:300,
      dist:500
    }
  },
  {name:"Inhibitor",
    sprite:"tourets",
    health:5000,
    speed:0,
    skills:{
      fist:600,
      exp:600,
      dist:1000
    }
  },
  {name:"Nexus",
    sprite:"tourets",
    health:5000,
    speed:0,
    skills:{
      fist:1200,
      exp:1200,
      dist:1500
    }
  },
  
]

module.exports = monstersTypes;