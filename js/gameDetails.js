const game = {
  time : new Date(),
  version : 0.2,
  fps: 15,
  db:"redis",
  lastUpdate: 1633895983384,
  devMode: true,
}
// module.exports = game;
if(typeof window == "undefined"){module.exports = game;}