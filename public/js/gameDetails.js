const game = {
  name:"Webions&beta;",
  time : new Date(),
  version : 0.3,
  fps: 16,
  db:"redis",
  lastUpdate: 1633895983384,
  dev: false,
  whatsNew: `
  v0.23 BETA<br />
  <p>
    Hey, <br />
    This is betatesting version of game. <br />
    If you find here bugs, or errors - connect to server owner.
  </p>

  `
}
if(typeof window == "undefined"){module.exports = game;}