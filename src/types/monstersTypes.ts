export default [
  { name:"Training Man",
  // type:"npc",
    // sprite:"trainingMan",
    sprite:"training_man",
    health:10000000,
    speed:false,
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
    speed:3,
    skills:{
      fist:400,
      exp:400,
      dist:450,
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
    health:1200,
    speed:2,
    skills:{
      fist:150,
      exp:120,
      dist:0,
      healing:50
    }
  },
  {name:"Orange Wizard",
    // sprite:"orangeWizard",
    sprite:"orange_wizard",
    health:1700,
    speed:3,
    skills:{
      fist:300,
      exp:300,
      dist:150,
      healing:100
    }
  },
  {name:"Maggot",
    sprite:"maggot",
    health:700,
    speed:2,
    skills:{
      fist:200,
      exp:100,
      dist:0,
      healing:50
    }
  },
  {name:"Cat",
    sprite:"cat",
    health:15,
    speed:1.5,
    skills:{
      fist:0,
      exp:0,
      dist:0
    }
  },
  {name:"Wasp",
    sprite:"wasp",
    health:250,
    speed:1.5,
    skills:{
      fist:50,
      exp:25,
      dist:0
    },
    loot:[
      {
        name : "Coins",
        amount : "5 - 50",
        freq: 1
      },
      {
        name : "Simple Shield",
        freq: 0.2
      }
    ]
  },
  {name:"Barbarian",
    sprite:"barbarian",
    health:150,
    speed:2.5,
    skills:{
      fist:50,
      exp:40,
      dist:0
    }
  },
  {name:"Barbarian Monk",
    sprite:"barbarian_monk",
    health:500,
    speed:3,
    skills:{
      fist:150,
      exp:80,
      dist:150
    }
  },

  // leauge 
  {name:"Touret",
    sprite:"tourets",
    health:5000,
    speed:false,
    skills:{
      fist:300,
      exp:300,
      dist:500
    }
  },
  {name:"Inhibitor",
    sprite:"tourets",
    health:5000,
    speed:false,
    skills:{
      fist:600,
      exp:600,
      dist:1000
    }
  },
  {name:"Nexus",
    sprite:"tourets",
    health:5000,
    speed:false,
    skills:{
      fist:1200,
      exp:1200,
      dist:1500
    }
  },
  
]