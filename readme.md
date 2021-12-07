# WEBIONS
  Webions is a MMORPG game working on browsers. 
  You can simply download [this repository](https://github.com/apietryga/webions2) and make server on your own by open "server.js" by nodejs. I will make instructions for this in future versions.

## TESTING NOW
  - rescale scores of inactive players
  - fixed database update on level promotion
  - fixed gameplane.js:28 Uncaught TypeError
  - fixed functions.js:102 Uncaught TypeError on karo player
  - decrease death penalty ( 10% to 5% )
  - [dev] del minimist and node-static dependencies (github dependency alert)
  - [dev] del makewww and generate public pages dynamically
  - show readme on main page

## WORKIN' ON
  - add lastFrame to players stats [page]
  - refresh [public] css's and js's dynamically
  - replace courier with mailgun - **to make repository public**
  - mobile item stats
  - IOS clicking compatibility
  - strict register names (no numbers and monsters names)
  - remove this.skills.healing opt, and improve healing with mana
  - fix doubled console message on sent
  - Landscape map control mobile
  - eq view in landscape mobile
  - walking throught static items
  - NPC's speaking
  - NPC's staying on saying
  - backpacks
  - dead body as item + LOOTING
  - nick always top
  - player above redtarget
  - add shielding
  - add magic lvl
  - ladder not display on player stats

## TO CATCH
  - bug with doubled characters (?) (creatures.update in gameplane? - when, how?)

## STORAGE
  By default the data store in simple redis server as JSON stringify, but it automatically changed to storing in JSON files, if redis connection is not set.

  Remember, that if you would host Webions server on heroku - JSON files will be cleared once a day - redis db not. 