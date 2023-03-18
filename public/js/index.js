const mV = document.querySelector("#mapViewer");

// map settings
const set = {
  scale: 1, 
  position: { 
    x: -350,
    y: -150,
    z: 0,
  },
  width: 1000,
  height:446,
}

// mouse settings
const ms = { 
  x: 0,
  y: 0,
}

const fullMapMin = new Image()
fullMapMin.src = '/img/page/fullmap.min.webp'
const ctx = mV.getContext('2d')

fullMapMin.addEventListener("load", e => {
  // ctx.drawImage(fullMapMin, 0, 0, set.width, set.height);
  ctx.drawImage(fullMapMin, set.position.x, set.position.y, set.width, set.height);
});

const fullMap = new Image();
fullMap.src = '/img/page/fullmap.webp'

let clicked = false

mV.addEventListener('mousedown', e => {
  clicked = true
  ms.x = Math.round(( e.offsetX * 100 ) / e.target.clientWidth )
  ms.y = Math.round(( e.offsetY * 100 ) / e.target.clientHeight )
})

window.addEventListener('mouseup', e => {
  clicked = false
  ms.x = 0
  ms.y = 0
})

mV.addEventListener('mousemove', e => {
  if(clicked){
    const x = Math.round(( e.offsetX * 100 ) / e.target.clientWidth )
    const y = Math.round(( e.offsetY * 100 ) / e.target.clientHeight )

    set.position.x +=  ( x - ms.x )
    set.position.y +=  ( y - ms.y )

    ms.x = x
    ms.y = y

    ctx.clearRect(0, 0, mV.width, mV.height);
    ctx.drawImage(fullMap, set.position.x, set.position.y, ( set.width * set.scale ), (set.height * set.scale));
  }
})

const arrows = document.querySelectorAll(".buttons button")
arrows.forEach( arr => {

  arr.addEventListener('click', e => { 
    if( "+" == e.target.innerText){
      set.scale *= 2;
    }

    if( "-" == e.target.innerText){
      set.scale /= 2;
    }

    if( "↓" == e.target.innerText){
      set.position.y -= 20;
    }

    if( "↑" == e.target.innerText){
      set.position.y += 20;
    }

    if( "←" == e.target.innerText){
      set.position.x += 20;
    }

    if( "→" == e.target.innerText){
      set.position.x -= 20;
    }

    ctx.clearRect(0, 0, mV.width, mV.height);
    ctx.drawImage(fullMap, set.position.x, set.position.y, ( set.width * set.scale ), (set.height * set.scale));
  })
})