
const nunjucks = require('nunjucks');
const path = require('path')
const dateFilter = require('nunjucks-date-filter');
const items = require('../types/itemsTypes')

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
    const env = nunjucks.configure(path.resolve(__dirname, '../views/'), {
      express   : app,
      autoescape: true,
      watch : true
    })
    .addFilter('getItem', item => {
      return {
        ...items.types.find( it => it.name == item.name ),
        ...item
      }
    })
    .addFilter('isArray', val => {
      if(!val){return false}
      if(val.constructor == Array){ return true }
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
      const index = icons.indexOf(key)
      return {
        name : index == -1 ? key : '',
        bgPosition: '-'+( index * 25 )+'px 0px'
      }
    })
    .addFilter('getStats', ([players, page]) => {
      if(page == 'lastdeaths'){
        players.forEach( p => {p.lastDeaths.forEach(d => { d.name = p.name } )})
        return players
        .flatMap(({ lastDeaths }) => lastDeaths)
        .sort((a, b) => {
          if(a.when > b.when){return -1}
          if(a.when < b.when){return 1}
        })
      }
      if(page == 'online'){
        return cm.players.list
      }
      players = players.filter(player => player.name != 'GM')
      return players.sort((a, b) => {
        if(a.skills[page] > b.skills[page]) { return -1 }
        if(a.skills[page] < b.skills[page]) { return 1 }
      })
    })
    .addFilter('date', dateFilter)
    require('nunjucks-global-uid')(env)
  }
}