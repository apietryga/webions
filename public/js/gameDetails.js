const game = {
  name:"Webions",
  time : new Date(),
  version : 0.48,
  fps: 16,
  db:"redis",
  lastUpdate: 1633895983384,
  dev: false,
  mapSize: [15, 11], // x y squares
  // mapSize: [200, 200], // x y squares
  square: 40, // px one square

}
if(typeof window == "undefined"){module.exports = game;}