# Webions
  Webions is a MMORPG game working on browsers. 
  You can simply download this repository and make server on your own by open "server.js" by nodejs.

  ## TESTING
    - rescale scores of inactive players
    - add eq and quests to players stats [page]
    - save players before server restart [testing heroku detection]
    - allow train on afk.
    - fix gameplane.js:28 Uncaught TypeError

  ## CRITICAL BUGS
    - less death penalty
    - Mobile item stats
    - IOS Compatibility
    - Bug with doubled characters (?)
      - creatures.update w gameplane - WTF?
    - mailgun
    - strict register names (no numbers and monsters names)
    - remove this.skills.healing opt, and improve healing with mana
    - fix doubled console message on sent
    - del makewww and generate public pages dynamically
    - show readme in main page
    - if player's online - show his stats dynamically
    - add lastFrame to players stats [page]

  ## TO DO
    - Landscape map control mobile
    - Eq view in landscape mobile
    - Walking throw static items
    - NPC's speaking
    - NPC's staying on saying
    - backpacks
    - Dead body as item + LOOTING
    - Nick always top
    - Player above redtarget
    - add shielding
    - add magic lvl
    - ladder not display on player stats

## STORAGE
  By default the data store in simple redis server as JSON stringyfy, but it automatically changed to storing in JSON files, if redis connection is not set.

  Remember, that if you would host Webions server on heroku - it clear your storage once a day so JSON files will be cleared - redis db not. 