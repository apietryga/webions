const game = {
  time : new Date(),
  version : 0.22,
  fps: 16,
  db:"redis",
  lastUpdate: 1633895983384,
  dev: false,
}
if(typeof window == "undefined"){module.exports = game;}