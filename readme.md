# Webions
  Webions is a MMORPG game working on browsers. 
  You can simply download this repository and make server on your own by open "server.js" by nodejs.

## BUGS TO FIXED IN 0.3 < versions
  # TESTING
    - grids rendering - DO NOT RENDER DOWN FLOORS!!
    - rescale scores in inactive players
    - last floor of random item quest broke. [check ladder walking]
    - Move to temple : !temple

  # CRITICAL
    - Console speaking problem
    - NPC's saying
  # TO DO
    - IOS Compatibility
    - Walking throw static items
    - Bug with doubled characters (?)
    - Landscape map control mobile
    - Eq view in landscape mobile
    - NPC's staying on saying
    - Add eq to players stats [page]
    - Mobile item stats
    - Dead body as item
    - Nick always top
    - Player above redtarget

## STORAGE
  By default the data store in simple redis server as JSON stringyfy, but it automatically changed to storing in JSON files, if redis connection is not set.

  Remember, that if you would host Webions server on heroku - it clear your storage once a day so JSON files will be cleared - redis db not. 