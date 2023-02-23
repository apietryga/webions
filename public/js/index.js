const mV = document.querySelector("#mapViewer");

const set = {
  scale: 1, 
  position: { 
    x: 0,
    y: 0,
    z: 0,
  },
  width: 1000,
  height:446,
}

// mV.width = 1000;
// mV.height = 446;

const fullMapMin = new Image()
fullMapMin.src = '/img/page/fullmap.min.webp'
const ctx = mV.getContext('2d')

fullMapMin.addEventListener("load", e => {
  ctx.drawImage(fullMapMin, 0, 0, set.width, set.height);
});

const fullMap = new Image();
fullMap.src = '/img/page/fullmap.webp'

mV.addEventListener('click', e => {
  const x = Math.round(( e.offsetX * 100 ) / e.target.clientWidth )
  const y = Math.round(( e.offsetY * 100 ) / e.target.clientHeight )
  console.log({ x, y })
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

// const arrowsArr = Array.from(arrows)
// console.log({arrows, arrowsArr})