const game = {
  name:"Webions",
  time : new Date(),
  version : 0.36,
  fps: 16,
  db:"redis",
  lastUpdate: 1633895983384,
  dev: false
}
if(typeof window == "undefined"){module.exports = game;}