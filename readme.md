## WEBIONS
  Webions is a MMORPG game working on browsers. 
  You can simply download [this repository](https://github.com/apietryga/webions2) and make server on your own by open "serwer.js" by nodejs. I will make instructions for this in future versions.
## TESTING NOW
  - manifest.json doesn't work on android
  - improve succesfully login animation [no form and wait for map load]
  - replace courier with mailgun
  - repair player kick (once - now 6 times...)
  - make icons for mana, health, etc
  - improve healing with mana
  - decrease mana after item drop
  - fix token - not saving in base [only JSON, Redis work i guess, or not ...].
  - console - get last writing pharse by up/down arrows
  - make offline as loader
  - improve offline detection
  - restore totalHealth and totalMana after death
  - strict url's like https://webions.herokuapp.com/libary/elo
  - [menus] save in cookies mainmenu toggle
  - [wwwscripts] health on (base + eq) [mana the same]
  - [wwwscripts] math round in skills (Zuzia case)
  - [wwwscripts] make Players > nickname (like in libary)
  - [wwwscripts] <720px bottom body bar wtf?
  - [server_components] first remove item from eq, then drop them. 
  - [server_components] one exhoust to shot and heal
  - [functions] monsters set route around windows, stairs
  - [controls] landscape map control mobile [planeclicking]
  - [controls] toggle mobile controls
  - [serwer] improve updating players without changing their's lastFrame 
  - [serwer] remove player.skills.healing 
## ISSUES
  - [serwer] disable heroku Idling (serv reload)
  - [serwer] secure websocket
  - [public] strict register names (no numbers and monsters names)
  - [menus] fix doubled console message on sent
  - [graphic] cyclop and dragon sprites update.
## FEATURES
  - [server_components] auto shooter
  - [server_components] shielding (def)
  - [server_components] magic lvl
  - [server_components] mwalls
  - [server_components] NPC's staying on saying and speaking
  - [server_components] backpacks and depos
  - [server_components] dead body as item + LOOTING
  - [map_editor] entire map image on index
  - [map_editor] deleting grids
  - protection zone
  - house zone
## TO CATCH
  - bug with doubled characters (creatures.update in gameplane? - when, how?) [8.12.2021]
  - [serwer_components] walking throught monsters / npc's (when, how?)
  - 
## STORAGE  
  By default the data store in simple redis server as JSON stringify, but it automatically changed to storing in JSON file ***/json/playersList.json***, if redis connection is not set.
  Remember, that if you would host game server on heroku - JSON files will be cleared once a day - redis db not. 