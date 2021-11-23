# Webions
  Webions is a MMORPG game working on browsers. 
  You can simply download this repository and make server on your own by open "server.js" by nodejs.

## gameDetails.js
  [ONDEPLOY]: SET dev = false (to GM can't login default.)

## BUGS TO FIX IN 0.3 < versions

  # TESTING
    - gameplane.js?v={{version}}:28 Uncaught TypeError: player.update is not a function

  # CRITICAL
    - SAVE PLAYERS STATS AND EQS BEFORE SERV CRASH 
    - Mobile item stats
    - IOS Compatibility
    - rescale scores in inactive players
    - Bug with doubled characters (?)
      - creatures.update w gameplane - WTF?
    - add delete acc opt
    - mailgun
  # TO DO
    - allow train on afk.
    - Add eq to players stats [page]
    - Landscape map control mobile
    - Eq view in landscape mobile
    - Walking throw static items
    - NPC's speaking
    - NPC's staying on saying
    - backpacks
    - Dead body as item + LOOTING
    - Nick always top
    - Player above redtarget

## STORAGE
  By default the data store in simple redis server as JSON stringyfy, but it automatically changed to storing in JSON files, if redis connection is not set.

  Remember, that if you would host Webions server on heroku - it clear your storage once a day so JSON files will be cleared - redis db not. 