const set = {
  scale: 1, 
  position: { 
    // x: -350,
    x: -500,
    y: -223,
    z: 0,
  },
  width: 1000,
  height:446,
  mouse: {
    x: 0,
    y: 0,
  }
}

const mV = document.querySelector("#mapViewer");
const ctx = mV.getContext('2d')
// const fullMapMin = new Image()
// fullMapMin.src = '/img/page/fullmap.min.webp'
// fullMapMin.addEventListener("load", e => {
//   console.log('load1', { e })
//   // ctx.drawImage(fullMapMin, 0, 0, set.width, set.height);
//   ctx.drawImage(fullMapMin, set.position.x, set.position.y, set.width, set.height);
// });

const fullMap = new Image();
fullMap.src = '/img/page/fullmap.webp'
// fullMapMin.addEventListener("load", e => {
fullMap.addEventListener("load", e => {

  // console.log('load2', { e })
  console.log({ fullMap })
  // ctx.clearRect(0, 0, mV.width, mV.height);
  // ctx.drawImage(fullMap, set.position.x, set.position.y, ( set.width * set.scale ), (set.height * set.scale));
  console.log({ fullMap })
  ctx.drawImage(
    fullMap, 
    set.position.x, 
    set.position.y, 
    set.width, 
    set.height,
    // fullMap.width, 
    // fullMap.height,


    // set.width * set.scale, 
    // set.height * set.scale,
    // 10, 10, 50, 60
    // 0, 0, fullMap.width, fullMap.height
    // set.position.x, 
    // set.position.y, 
    // set.width, 
    // set.height,

  )

  //  // ctx.drawImage(fullMapMin, 0, 0, set.width, set.height);
  // ctx.drawImage(fullMapMin, set.position.x, set.position.y, set.width, set.height);
});

let clicked = false

mV.addEventListener('mousedown', e => {
  clicked = true
  set.mouse.x = Math.round(( e.offsetX * 100 ) / e.target.clientWidth )
  set.mouse.y = Math.round(( e.offsetY * 100 ) / e.target.clientHeight )
})

window.addEventListener('mouseup', e => {
  clicked = false
  set.mouse.x = 0
  set.mouse.y = 0
})

mV.addEventListener('mousemove', e => {
  if(clicked){
    const x = Math.round(( e.offsetX * 100 ) / e.target.clientWidth )
    const y = Math.round(( e.offsetY * 100 ) / e.target.clientHeight )

    set.position.x +=  ( x - set.mouse.x )
    set.position.y +=  ( y - set.mouse.y )

    set.mouse.x = x
    set.mouse.y = y

    ctx.clearRect(0, 0, mV.width, mV.height);
    ctx.drawImage(fullMap, set.position.x, set.position.y, ( set.width * set.scale ), (set.height * set.scale));
  }
})

// const arrows = document.querySelectorAll(".buttons button")
// arrows.forEach( arr => {
document.querySelectorAll(".buttons button").forEach( arr => {
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