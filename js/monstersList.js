const monstersList = [
  // default
  {name:"Dragon",
    sprite:"dragon",
    health:1000,
    speed:2,
    skills:{
      fist:400,
      exp:10,
      dist:0
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
    health:1500,
    speed:1.5,
    skills:{
      fist:500,
      exp:50,
      dist:0
    }
  },
  {name:"Orange Wizard",
    sprite:"orangeWizard",
    health:1500,
    speed:3,
    skills:{
      fist:500,
      exp:50,
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

module.exports = monstersList;