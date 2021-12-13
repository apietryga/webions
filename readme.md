# WEBIONS
  Webions is a MMORPG game working on browsers. 
  You can simply download [this repository](https://github.com/apietryga/webions2) and make server on your own by open "server.js" by nodejs. I will make instructions for this in future versions.

## TESTING NOW
  - add lastFrame to players stats [page]
  - refresh [public] css's and js's dynamically (fixed when smth not loading )
  - don't kick players when app is not focus
  - script's mime types (currently is text/js) [account.js]
  - auto login players even if serv crash
  - auto back to game after serv is disconect
  - restore player targets after relogin
  - catch all err's [in logs.json]
  - items eq not display on player stats
  - display eq on page [loading failed - why?]

## WORKIN' ON
  - fix doubled console message on sent
  - display lastframe hour - minutes break.
  - make subpages for libary
  - repair player kick (once - now 6 times...)
  - in console placeholder write "click enter to type" on pc 
  - replace courier with mailgun - **to make repository public**
  - get gitting without def (from eq) when kicked (most on train's)
  - base mana regen
  - mobile item stats
  - IOS clicking compatibility
  - strict register names (no numbers and monsters names)
  - remove this.skills.healing opt, and improve healing with mana
  - landscape map control mobile
  - eq view in landscape mobile
  - walking throught static items/monsters (not players and empty boxes, hmm?)
  - NPC's speaking
  - NPC's staying on saying
  - backpacks
  - dead body as item + LOOTING
  - nick always top
  - player above redtarget
  - add shielding
  - add magic lvl
  - SSL 

## TO CATCH
  - Unexpected server crash (when?, why?) [8.12.2021]
  - bug with doubled characters (creatures.update in gameplane? - when, how?) [8.12.2021]

## STORAGE
  By default the data store in simple redis server as JSON stringify, but it automatically changed to storing in JSON file ***/json/playersList.json***, if redis connection is not set.
  Remember, that if you would host game server on heroku - JSON files will be cleared once a day - redis db not. 