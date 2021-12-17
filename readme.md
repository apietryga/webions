# WEBIONS
  Webions is a MMORPG game working on browsers. 
  You can simply download [this repository](https://github.com/apietryga/webions2) and make server on your own by open "serwer.js" by nodejs. I will make instructions for this in future versions.

## TESTING NOW
  - replace courier with mailgun - **to make repository public**
  - SIGTERM uncaughtException at /app/js/public.js:136:13
  - secure public

## WORKIN' ON
  - firefox compatibility [gameplane order rendering suck]
  - Uncaught TypeError: Cannot read properties of undefined (reading 'empty') [game.html:17]
  - make subpages for libary
  - fix token - not saving in base.
  - landscape map control mobile [planeclicking]
  - display lastframe hour - minutes break. improve months 
  - disable players updating on serv start.
  - fix doubled console message on sent
  - repair player kick (once - now 6 times...)
  - fix get hitting without def (from eq) when kicked (most on train's)
  - base mana regen
  - strict register names (no numbers and monsters names)
  - remove Creature.skills.healing, and improve healing with mana
  - walking throught static items/monsters (not players and empty boxes, hmm?)
  - NPC's staying on saying and speaking
  - backpacks and depos
  - dead body as item + LOOTING
  - nick always top
  - player above redtarget
  - add shielding
  - add magic lvl
  - SSL 
  - secure websocket
  - entire map image on index
  - improve succesfully login animation [no form and wait for map load
  - protection zone
  - house zone
  - first remove item from eq, then drop them. 
  - in register, fill checked sex value
  - controls 168
  - if user write space in mail, remove it.
  - online list - not kicking players
  - make downcase letters in login (can rozin login as Rozin)

## TO CATCH
  - Unexpected server crash (when?, why?) [8.12.2021]
  - bug with doubled characters (creatures.update in gameplane? - when, how?) [8.12.2021]

## STORAGE
  By default the data store in simple redis server as JSON stringify, but it automatically changed to storing in JSON file ***/json/playersList.json***, if redis connection is not set.
  Remember, that if you would host game server on heroku - JSON files will be cleared once a day - redis db not. 