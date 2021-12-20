# WEBIONS
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
## ISSUES
  - make offline as loader
  - restore totalHealth and totalMana after death
  - walking throught static items/monsters (not players and empty boxes, hmm?)
  - strict url's like http://localhost/libary/elo
  - strict register names (no numbers and monsters names)
  - landscape map control mobile [planeclicking]
  - fix doubled console message on sent
  - replace Creature.skills.healing, to skills.def 
  - health on [public] (base + eq) [mana the same]
  - first remove item from eq, then drop them. 
  - toggle mobile controls
  - disable heroku Idling (serv reload)
  - one exhoust to shot, heal and mwall 
  - cyclop and dragon sprites update.
  - monsters and nps's walking around windows, stairs
  - public <720px bottom body bar wtf?
  - secure websocket
## FEATURES
  - auto shooter
  - NPC's staying on saying and speaking
  - backpacks and depos
  - dead body as item + LOOTING
  - add shielding
  - add magic lvl
  - entire map image on index
  - protection zone
  - mwalls
  - house zone
## TO CATCH
  - bug with doubled characters (creatures.update in gameplane? - when, how?) [8.12.2021]
## STORAGE
  By default the data store in simple redis server as JSON stringify, but it automatically changed to storing in JSON file ***/json/playersList.json***, if redis connection is not set.
  Remember, that if you would host game server on heroku - JSON files will be cleared once a day - redis db not. 