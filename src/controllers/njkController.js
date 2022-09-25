
const nunjucks = require('nunjucks');
const path = require('path')
const skipTH = [
  'desc', 
  'spriteNr',
  'sprite',
  'randStats', 
  'walkThrow',	
  'walkOn',
  'amount',
  'handle',
  'pickable'
]

module.exports = {
  configure(app){
    nunjucks.configure(path.resolve(__dirname, '../views/'), {
      express   : app,
      autoescape: true,
      watch : true
    })
    .addFilter('isObject', val => {
      if(!val){return false}
      if(val.constructor == Object){ return true }
    })
    .addFilter('getHeaders', arr => {
      const headers = [""]
      for(const item of arr){
        for(const key of Object.keys(item)){
          if(!skipTH.includes(key) && !headers.includes(key)){
            headers.push(key)
          }
        }
      }
      return headers
    })
    .addFilter('getImg', item => {
      const isItem = typeof item.spriteNr != 'undefined';
      return {
        positionY: isItem ? item.spriteNr*40 - (item.spriteNr*40 * 2)  : 240,
        positionX: isItem ? 0  : -80,
        size:      isItem ? 40  : 80,
        backgroundSize: isItem ? item.sprite == 'action_items' ? 400 +'px 100%' : 800 +'px 100%' : 'unset',
      }
    })
    .addFilter('getIco', key => {
      if(key == ""){ return }
      const icons = [
        'fist', 
        'dist',
        'mana', 
        'manaRegen',
        'def', 
        'health', 
        'healthRegen', 
        'speed', 
        'exp',
      ]
      // const index = icons.findIndex(ico => { return ico == key })
      const index = icons.indexOf(key)
      // console.log(key, index)
      return {
        // bgPosition: '-125px 0px'
        name : index == -1 ? key : '',
        bgPosition: '-'+( index * 25 )+'px 0px'
      }
    })
    .addFilter('getStats', ([players, page]) => {
      if(['online', 'lastdeaths'].includes(page)){ return []}

      return players.sort((a, b) => {
        if(a.skills[page] > b.skills[page]) { return -1 }
        if(a.skills[page] < b.skills[page]) { return 1 }
      })
    })
  }
}