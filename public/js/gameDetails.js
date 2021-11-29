const game = {
  name:"Webions",
  time : new Date(),
  version : 0.32,
  fps: 16,
  db:"redis",
  lastUpdate: 1633895983384,
  dev: false,
  whatsNew: `
  <p>
    Hey, <br />
    This is testing version of game. <br />
    If you find here bugs, or errors - connect to server owner.
  </p>
  `
}
if(typeof window == "undefined"){module.exports = game;}