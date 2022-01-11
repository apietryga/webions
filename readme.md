# WEBIONS
  Webions is a MMORPG game working on browsers. 
  You can simply download [this repository](https://github.com/apietryga/webions2) and make server on your own by open "serwer.js" by nodejs. I will make instructions for this in future versions.
## TESTING NOW
  - manifest.json doesn't work on android (no install option) [PWA's Manifests](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Installable_PWAs)
  - [multiplechars] walking through monsters
  - [multiplechars] getting items from chests
  - [multiplechars] walking through static items
  - [multiplechars] pickuping items
  - [multiplechars] changing char on serv reload
  - walking through monsters && ladder not working (where someone is on serv, but not
  - [server_cm] doubled char error (when connection err and then reload) [25.12.2021]
  - [server_cm] third player merge with second? wtf [10.01.2022]
  - [server_cm] bug with doubled characters (creatures.update in gameplane? - when, how?) [8.12.2021]
  - [gamePlane.creatures] - check if includes before push.
  - [gamePlane.creatures] - strict to only one player!
  - [serwer_components] walking throught monsters / npc's (when, how?)
in area)
  - monsters target nearbiest not first. 
  - stairs walking when something are on the other side
## ISSUES
  - [server_components] backpacks and depos
  - [server_components] dead body as item + LOOTING
  - [server_components] NPC's staying on saying, speaking and trading
  - monsters between barbarians and maggots
  - protection zone
  - house zone
  - improve offline detection & player kicking
  - console messages not always received 
  - captcha's [register, login, forgot]
  - [serwer] secure websocket
  - secure redis.
  - [map_editor] entire map image on index
  - [map_editor] deleting grids
  - optimize code...
  - firefox planeclicking
## STORAGE
  By default the data store in simple redis server as JSON stringify, but it automatically changed to storing in JSON file ***/json/playersList.json***, if redis connection is not set.
  Remember, that if you would host game server on heroku - JSON files will be cleared once a day - redis db not. 