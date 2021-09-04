# Webions
  Webions is a MMORPG game working on browsers. 

  

## STORAGE
  By default the data store in simple redis server as JSON.stringygy, but it automatically changed to storing in JSON files, if redis connection is not set.

  Remember, that if you would host Webions server on heroku - it clear your storage once a day so JSON files will be cleared - redis db not. 