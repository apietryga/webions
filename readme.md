# WEBIONS
  Webions is a MMORPG game working on browsers. 
  You can simply download [this repository](https://github.com/apietryga/webions2) and make server on your own by open "serwer.js" by nodejs. I will make instructions for this in future versions.

## TESTING NOW
  - planeclicking

## ISSUES
  - planeclicking stairs
  - NPC's staying on saying, speaking and trading
  - monsters walking through static items 
  - moving through stairs when monster's there
  - login without cookies (once)
  - improve target unselect
  - in labels label show desc, cap and amount
  - protection zone
  - house zone
  - console messages not always received 
  - captcha's [register, login, forgot]
  - secure websocket
  - entire map image on index
  - deleting grids
  - optimize code
  - optimize memory
  - picking items to bp in bp etc.
  - move items between containers

## STORAGE
  By default the data store in simple redis server as JSON stringify, but it automatically changed to storing in JSON file ***/json/playersList.json***, if redis connection is not set.
  Remember, that if you would host game server on heroku - JSON files will be cleared once a day - redis db not. 