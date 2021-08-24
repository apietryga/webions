const monstersList = [
  // {name:"Mage",
  //   id:3,
  //   // position:[0,7,1], // left tower
  //   // position:[1,2,0],
  //   position:[20,19,0],
  //   // startPosition:[1,2,0],
  //   startPosition:[20,19,0],
  //   sprite:"mmage",
  //   type:"monster",
  //   health:10000,
  //   maxHealth:10000,
  //   speed:2.5,
  //   skills:{
  //     fist:400,
  //     exp:1
  //   }
  // }
  // ,
  {name:"Dragon",
    id:1,
    position:[0,7,1], // left tower
    // position:[0,3,0],
    startPosition:[0,7,1],
    sprite:"dragon",
    type:"monster",
    health:10000,
    // maxHealth
    maxHealth:10000,
    speed:2,
    skills:{
      fist:1,
      exp:30
    }
  },
  // {name:"Cyclops",
  //   id:2,
  //   position:[15,7,1], // right tower
  //   // position:[4,3,0],
  //   startPosition:[15,7,1],
  //   sprite:"cyclops",
  //   type:"monster",
  //   health:15000,
  //   maxHealth:15000,
  //   speed:6,
  //   skills:{
  //     fist:10,
  //     exp:15
  //   }
  // }
  // ,
  // {name:"Hellknight",
  //   id:4,
  //   // position:[0,7,1], // left tower
  //   position:[3,16,0],
  //   startPosition:[3,16,0],
  //   sprite:"hellknight",
  //   type:"monster",
  //   health:10000,
  //   // maxHealth
  //   maxHealth:10000,
  //   speed:3,
  //   skills:{
  //     fist:2,
  //     exp:150
  //   }
  // }
]

module.exports = monstersList;