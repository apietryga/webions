# WEBIONS
  Webions is a MMORPG game working on browsers. 
  You can simply download [this repository](https://github.com/apietryga/webions2) and make server on your own by open "serwer.js" by nodejs. I will make instructions for this in future versions.
## TESTING NOW
  - [refreshing] manifest.json doesn't work on android
  - [server_cm] bug with doubled characters
  - [dragons] map updated, to fight with mwalls
  - blue 17
  - [temple_roof] Uncaught TypeError: Cannot read properties of undefined (reading 'height')
    at Item.draw (components.js?v=0.46:670:19)
  - tables
  - [server_components] backpacks

## ISSUES
  - menus on click and show
  - opened menus on cookies
  - [server_components] depos
  - [server_components] coins
  - [server_components] dead body as item
  - [server_components] looting
  - [server_components] NPC's staying on saying, speaking and trading
  - [last_dragon] monsters walking through static items 
  - login without cookies (once)
  - players list on hash map (improve logout quene)
  - items z-index
  - improve target unselect
  - [first_dragon] stairs moving when monster's there
  - in labels label show desc and cap
  - trees 
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
  - CSP
  - firefox planeclicking
  - optimize code
  - optimize memory
## STORAGE
  By default the data store in simple redis server as JSON stringify, but it automatically changed to storing in JSON file ***/json/playersList.json***, if redis connection is not set.
  Remember, that if you would host game server on heroku - JSON files will be cleared once a day - redis db not. 