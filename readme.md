## WEBIONS
  Webions is a MMORPG game working on browsers. 
  You can simply download [this repository](https://github.com/apietryga/webions2) and make server on your own by open "serwer.js" by nodejs. I will make instructions for this in future versions.
## TESTING NOW
  - manifest.json doesn't work on android
  - improve succesfully login animation [no form and wait for map load]
  - replace courier with mailgun [48h blocked -.-]
  - repair player kick (once - now 6 times...)
  - make icons for mana, health, etc
  - improve healing with mana
  - decrease mana after item drop
  - fix token - not saving in base [only JSON, Redis work i guess, or not ...].
  - console - get last writing pharse by up/down arrows
  - make offline as loader
  - improve offline detection
  - restore totalHealth and totalMana after death
  - strict url's like http://localhost/libary/elo
  - [wwwscripts] health on (base + eq) [mana the same]
  - [wwwscripts] math round in skills (Zuzia case)
  - [wwwscripts] make Players > nickname (like in libary)
  - [wwwscripts] <720px bottom body bar wtf?
  - [server_components] first remove item from eq, then drop them. 
  - [server_components] one exhoust to shot and heal
## ISSUES
  - [server_components] monsters following around windows, stairs
  - [menus] fix doubled console message on sent
  - [controls] landscape map control mobile [planeclicking]
  - [controls] toggle mobile controls
  - [serwer] remove player.skills.healing 
  - [serwer] disable heroku Idling (serv reload)
  - [serwer] secure websocket
  - [public] strict register names (no numbers and monsters names)
  - [graphic] cyclop and dragon sprites update.
## FEATURES
  - auto shooter
  - shielding (def)
  - magic lvl
  - mwalls
  - NPC's staying on saying and speaking
  - backpacks and depos
  - dead body as item + LOOTING
  - entire map image on index
  - protection zone
  - house zone
## TO CATCH
  - bug with doubled characters (creatures.update in gameplane? - when, how?) [8.12.2021]
  - [serwer_components] walking throught monsters / npc's (when, how?)
  - 

## STORAGE  
  By default the data store in simple redis server as JSON stringify, but it automatically changed to storing in JSON file ***/json/playersList.json***, if redis connection is not set.
  Remember, that if you would host game server on heroku - JSON files will be cleared once a day - redis db not. 