console.log("LOADING INDEX SCRIPT")
const set = {
  scale: 1, 
  width: 500,
  height: 223,
  // width: 300,
  // height: 150,
  // width: 9241,
  // height: 4122,
  position: { 
    // x: -500,
    // y: -300,
    x: 0,
    y: 0,
    z: 0,
  },
  mouse: {
    x: 0,
    y: 0,
  }
}

const drawMap = () => {
  // console.log('drawnig')
  ctx.clearRect(0, 0, mV.width, mV.height);

  const draw = [
    fullMap,
    set.position.x, 
    set.position.y, 
    set.width * set.scale, 
    set.height * set.scale,
    // set.position.x + set.width / 2 , 
    // set.position.x + fullMap.width / 2 , 
    // fullMap.width,
    // fullMap.height,
    // 0,0,
    // 1000, 1000
    // set.width * set.scale, 
    // set.height * set.scale,

  ]

  // const fM = { width, height } = fullMap
  const fM = fullMap
  // const mVs = { width, height } = mV
  const mVs = { width, height } = mV
  // console.log({ ...draw, w: mV.width, w1: fM.width })
  console.log({ pos_x: draw[1], w0: draw[3], w1: mV.width, w2: fM.width })
  console.log({ pos_y: draw[2], h0: draw[4], h1: mV.height, h2: fM.height })

  ctx.drawImage(
    ...draw
    // fullMap, 
    // set.position.x - fullMap.width / 2, 
    // set.position.x, 
    // set.position.y, 
    // set.width * set.scale, 
    // set.height * set.scale,
  );
}

const mV = document.querySelector("#mapViewer");
const ctx = mV.getContext('2d')
const fullMap = new Image();
fullMap.src = '/img/page/fullmap.webp'
fullMap.addEventListener("load", e => {
  mV.height = set.height
  mV.width = set.width
  // set.width = fullMap.width
  // set.height = fullMap.height
  // height: 446,
  // console.log()
  // mV.width = fullMap.width
  // mV.height = fullMap.height
  // console.log('load2', { e })
  console.log({ fullMap })
  drawMap()
  
  // ctx.clearRect(0, 0, mV.width, mV.height);
  // ctx.drawImage(fullMap, set.position.x, set.position.y, ( set.width * set.scale ), (set.height * set.scale));
  // console.log({ fullMap })
  // ctx.drawImage(
  //   fullMap, 
  //   set.position.x, 
  //   set.position.y, 
  //   set.width, 
  //   set.height,
  //   // fullMap.width, 
  //   // fullMap.height,


  //   // set.width * set.scale, 
  //   // set.height * set.scale,
  //   // 10, 10, 50, 60
  //   // 0, 0, fullMap.width, fullMap.height
  //   // set.position.x, 
  //   // set.position.y, 
  //   // set.width, 
  //   // set.height,

  // )


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

    drawMap()
    // ctx.clearRect(0, 0, mV.width, mV.height);
    // ctx.drawImage(fullMap, set.position.x, set.position.y, ( set.width * set.scale ), (set.height * set.scale));
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

    drawMap()
    // ctx.clearRect(0, 0, mV.width, mV.height);
    // ctx.drawImage(fullMap, set.position.x, set.position.y, ( set.width * set.scale ), (set.height * set.scale));
  })
})


