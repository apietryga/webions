# WEBIONS
  Webions is a MMORPG game working on browsers. 
  You can simply download [this repository](https://github.com/apietryga/webions2) and make server on your own by open "serwer.js" by nodejs. I will make instructions for this in future versions.

## TESTING NOW
  - manifest.json doesn't work on android
  - bug with doubled characters
  - map updated, to fight with mwalls (dragons)
  - blue 17 house (south of map)
  - fixed TypeError: at Item.draw (components.js?v=0.46:670:19)
  - tables
  - backpacks
  - items z-index
  - order of picking items
  - chest with backpack in temple
  - pretty walls in depo and temple
  - improve throwing items
  - depo lockers
  - change all styles to *.min.css
  - improve getting items from box (to bp)
  - amount items (mainly coins)
  - looting
  - dead body animation

## ISSUES
  - NPC's staying on saying, speaking and trading
  - monsters walking through static items 
  - login without cookies (once)
  - improve target unselect
  - moving through stairs when monster's there
  - in labels label show desc, cap and amount
  - protection zone
  - house zone
  - console messages not always received 
  - captcha's [register, login, forgot]
  - secure websocket
  - entire map image on index
  - deleting grids
  - firefox planeclicking
  - optimize code
  - optimize memory
  - picking items to bp in bp etc.
  - move items between containers

## STORAGE
  By default the data store in simple redis server as JSON stringify, but it automatically changed to storing in JSON file ***/json/playersList.json***, if redis connection is not set.
  Remember, that if you would host game server on heroku - JSON files will be cleared once a day - redis db not. 