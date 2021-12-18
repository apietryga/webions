# WEBIONS
  Webions is a MMORPG game working on browsers. 
  You can simply download [this repository](https://github.com/apietryga/webions2) and make server on your own by open "serwer.js" by nodejs. I will make instructions for this in future versions.

## TESTING NOW
  - display lastFrame correctly - improve minutes, hours and months 
  - disable players updating on serv start.
  - gameplane.js:28:10 player.update is undefined
  - player above redtarget
  - nick always top
  - firefox compatibility buttons LO MP
  - ingameconsole - disable undefined message
  - improve succesfully login animation [no form and wait for map load]
  - replace courier with mailgun - **to make repository public**
  - Unexpected server crash (when?, why?) [8.12.2021] - it might be for this two:
  - SIGTERM uncaughtException at /app/js/public.js:136:13
  - secure public
  - Uncaught TypeError: Cannot read properties of undefined (reading 'empty') [game.html:17]
  - firefox compatibility gameplane order rendering
  - MIME types - wtf is going on with https://webions.herokuapp.com/apple-touch-icon-precomposed.png , https://webions.herokuapp.com/apple-touch-icon.png ?
  - force HTTPS not HTTP
  - sprites.js:141 Uncaught SyntaxError: Unexpected identifier
  - manifest.json:29 Manifest: Line: 29, column: 1, Unexpected data after root element.
  - Uncaught TypeError: consoleInput is null controls:273
  - halffloors upper than floors
  - render windows above floors (temple)
  - in register, fill checked sex value
## WORKIN' ON
  - make subpages for libary
  - online list [public] - not kicking players 
  - disable heroku Idling (serv reload)
  - opt auto shooter
  - one exhoust to shot, heal and mwall 
  - on public skills, set totalFist, total dist ect. ex( 100 + 20 )
  - improve public health and mana %
  - strict url's like http://localhost/libary/elo
  - fix token - not saving in base [only JSON, Redis work i guess, or not ...].
  - improve token cookie (samesite)
  - strict register names (no numbers and monsters names)
  - if user has write space in mail, remove it.
  - make downcase letters in login (can rozin login as Rozin)
  - landscape map control mobile [planeclicking]
  - fix doubled console message on sent
  - repair player kick (once - now 6 times...)
  - fix get hitting without def (from eq) when kicked (most on train's)
  - base mana regen [replace simple legs with simple helmet]
  - remove Creature.skills.healing, and improve healing with mana
  - walking throught static items/monsters (not players and empty boxes, hmm?)
  - monsters and nps's walking around doors, windows, staticItems
  - NPC's staying on saying and speaking
  - backpacks and depos
  - dead body as item + LOOTING
  - add shielding
  - add magic lvl
  - secure websocket
  - entire map image on index
  - protection zone
  - house zone
  - first remove item from eq, then drop them. 
  - controls 168
  - mwalls
  - toggle mobile controls

## TO CATCH
  - bug with doubled characters (creatures.update in gameplane? - when, how?) [8.12.2021]

## STORAGE
  By default the data store in simple redis server as JSON stringify, but it automatically changed to storing in JSON file ***/json/playersList.json***, if redis connection is not set.
  Remember, that if you would host game server on heroku - JSON files will be cleared once a day - redis db not. 