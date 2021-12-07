const game = {
  name:"Webions",
  time : new Date(),
  version : 0.32,
  fps: 16,
  db:"redis",
  lastUpdate: 1633895983384,
  dev: true
}
if(typeof window == "undefined"){module.exports = game;}