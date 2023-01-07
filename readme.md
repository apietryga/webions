# WEBIONS

[CLICK HERE TO PLAY](https://webions.uk/game)

Webions is a MMORPG game working on browsers. (Like Tibia in borwser) 
You can simply download [this repository](https://github.com/apietryga/webions) and make server on your own by open "src/server.js" by nodejs. I will make instructions for this in future versions.

## FIRST RUN
1. Get the repository
```bash
  git clone https://github.com/apietryga/webions
```
2. Install dependencies
```bash
  npm i
```
3. Run game
```bash
  npm run start
```
4. Go to [localhost](http://localhost)


## STORAGE
  By default the data store in simple redis server as JSON stringify, but it automatically changed to storing in JSON file ***/json/playersList.json***, if redis connection is not set.



run:
```bash
(npm run start&)
```


kill -9 $(lsof -t -i:2095)

(npm run start&)