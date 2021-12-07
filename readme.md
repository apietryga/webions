# Webions
  Webions is a MMORPG game working on browsers. 
  You can simply download this repository and make server on your own by open "server.js" by nodejs.

  ## TESTING
    - rescale scores of inactive players
    - fixed db update on promotion
    - fix gameplane.js:28 Uncaught TypeError
    - functions.js:102 Uncaught TypeError: Cannot convert undefined or null to object (karo page)
    - less death penalty ( 10% to 5% )
    - [dev] del minimist and node-static dependencies (Github dependency alert)

  ## CRITICAL BUGS
    - del makewww and generate public pages dynamically
    - show readme in main page
    - add lastFrame to players stats [page]
    - refresh [public] css's and js's dynamically
    - mailgun

    - Mobile item stats
    - IOS Compatibility
    - Bug with doubled characters (?)
      - creatures.update w gameplane - WTF?
    - strict register names (no numbers and monsters names)
    - remove this.skills.healing opt, and improve healing with mana
    - fix doubled console message on sent

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