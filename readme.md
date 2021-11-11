# Webions
  Webions is a MMORPG game working on browsers. 
  You can simply download this repository and make server on your own by open "server.js" by nodejs.

## SPRITES
https://tibia.fandom.com/wiki/Updates/10.30/Sprites
https://otland.net/threads/8-6-client-need-few-sprites-paid-job-asap.268046/


## STORAGE
  By default the data store in simple redis server as JSON stringyfy, but it automatically changed to storing in JSON files, if redis connection is not set.

  Remember, that if you would host Webions server on heroku - it clear your storage once a day so JSON files will be cleared - redis db not. 