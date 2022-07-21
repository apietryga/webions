this.npcs = [
  { name:"Slepo Oma",
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
    speaker : [], 
    dial : [
      {"hi" : "Hi ello! {name}! \n Walk on this boxes to get nice items!"}
    ],
    dialog:(npc,player) => {
      if(player.says == "hi"){
        if(player.quests.includes("Simple Boots")){
          npc.says = "I have no more quests. \n Go to the king in the north castle."
        }else{
          npc.says = "Hi "+player.name+"! \n Walk on this boxes to get nice items!"; 
        }
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
    },
    dialog:(npc,player) => {
      if(player.says == "hi"){
        if(player.quests.includes("Rod")){
          npc.says = "If you want better rod, kill the Minotaur!"
        }else{
          npc.says = "Hi "+player.name+"! \n Rod for you is in the box."; 
        }
      }
    }
  },
]