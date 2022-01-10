# WEBIONS
  Webions is a MMORPG game working on browsers. 
  You can simply download [this repository](https://github.com/apietryga/webions2) and make server on your own by open "serwer.js" by nodejs. I will make instructions for this in future versions.
## TESTING NOW
  - [server_components] mwalls.
  - auto waller
  - disable mwalls shot through
  - improve mwalls in monsters routing
  - mwalls visibility (between floors and above items)
  - improve monsters exp (mainly orange wizards, maggots, cycs)
  - separate exhaust for healing, shooting and mwalls
  - [menus_labels] add name of item 
  - refresh option in PG MP LG
  - change lifetme of existing wall (not making new.)
  - strict mwalls in player area
  - update waller button on autoMWallDrop
  - improve monsters healing
## ISSUES
  - merge whitetarget with redtarget
  - [server_components] dead body as item + LOOTING
  - [server_components] backpacks and depos
  - [server_components] NPC's staying on saying, speaking and trading
  - monsters between barbarians and maggots
  - protection zone
  - house zone
  - manifest.json doesn't work on android (no install option) [PWA's Manifests](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Installable_PWAs)
  - improve offline detection
  - console messages not always received 
  - [serwer] secure websocket
  - captcha's [register, login, forgot]
  - secure redis.
  - [map_editor] entire map image on index
  - [map_editor] deleting grids
## TO CATCH
  - bug with doubled characters (creatures.update in gameplane? - when, how?) [8.12.2021]
  - doubled char error (when connection err and then reload) [25.12.2021]
  - [serwer_components] walking throught monsters / npc's (when, how?)
  - walking through monsters && ladder not working (where someone is on serv, but not in area)
## STORAGE
  By default the data store in simple redis server as JSON stringify, but it automatically changed to storing in JSON file ***/json/playersList.json***, if redis connection is not set.
  Remember, that if you would host game server on heroku - JSON files will be cleared once a day - redis db not. 