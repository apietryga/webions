# Webions
  Webions is a MMORPG game working on browsers. 
  You can simply download this repository and make server on your own by open "server.js" by nodejs.

## BUGS TO FIXED IN 0.3 < versions
  # CRITICAL
    - grids rendering - DO NOT RENDER DOWN FLOORS!!
    - rescale scores in inactive players
    - last floor of random item quest broke.

  1. IOS Compatibility
  2. Creatures totalhealth in creatures draw
  3. Walking throw static items
  4. Bug with doubled characters (?)
  5. Console speaking problem
  6. Landscape map control mobile
  7. Eq view in landscape mobile
  8. NPC's staying on saying
  9. Add eq to players stats [page]
  10. Mobile item stats
  11. Dead body as item
  12. Nick always top
  13. Player above redtarget
  14. Move to temple : !temple

## STORAGE
  By default the data store in simple redis server as JSON stringyfy, but it automatically changed to storing in JSON files, if redis connection is not set.

  Remember, that if you would host Webions server on heroku - it clear your storage once a day so JSON files will be cleared - redis db not. 