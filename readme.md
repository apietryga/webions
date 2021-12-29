## WEBIONS
  Webions is a MMORPG game working on browsers. 
  You can simply download [this repository](https://github.com/apietryga/webions2) and make server on your own by open "serwer.js" by nodejs. I will make instructions for this in future versions.
## TESTING NOW
## ISSUES
  - [server_components] mwalls
  - [server_components] NPC's staying on saying and speaking
  - [server_components] backpacks and depos
  - [server_components] dead body as item + LOOTING
  - [map_editor] entire map image on index
  - [map_editor] deleting grids
  - protection zone
  - house zone
  - manifest.json doesn't work on android (no install option) - https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Installable_PWAs
  - improve offline detection
  - console messages not always received 
  - [serwer] secure websocket
## TO CATCH
  - bug with doubled characters (creatures.update in gameplane? - when, how?) [8.12.2021]
  - doubled char error (when connection err and then reload) [25.12.2021]
  - [serwer_components] walking throught monsters / npc's (when, how?)
  - walking through monsters (where someone is on serv, but not in area)
## STORAGE  kran
  By default the data store in simple redis server as JSON stringify, but it automatically changed to storing in JSON file ***/json/playersList.json***, if redis connection is not set.
  Remember, that if you would host game server on heroku - JSON files will be cleared once a day - redis db not. 