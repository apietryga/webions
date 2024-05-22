// const set = {
//   scale: 2, 
//   width: 500,
//   height: 223,
//   position: { 
//     x: 150,
//     y: 50,
//     z: 0,
//   },
//   mouse: {
//     x: 0,
//     y: 0,
//     speed: 2,
//   }
// }

// const drawMap = () => {
//   ctx.clearRect(0, 0, mV.width, mV.height);
//   ctx.drawImage(
//     // ...draw
//     fullMap,
//     set.position.x + ((fullMap.width / 2) - (set.width * set.scale / 2)),
//     set.position.y + ((fullMap.height / 2) - (set.height * set.scale / 2)),
//     set.width * set.scale,
//     set.height * set.scale,
//     0,0,
//     set.width,
//     set.height,
//   );
// }

// const mV = document.querySelector("#mapViewer");
// const ctx = mV.getContext('2d')
// const fullMap = new Image();
// fullMap.src = '/img/page/fullmap.webp'
// fullMap.addEventListener("load", e => {
//   document.querySelector(".celownik").innerHTML = "+"
//   mV.height = set.height
//   mV.width = set.width
//   drawMap()
// });

// let clicked = false

// mV.addEventListener('mousedown', e => {
//   clicked = true
//   set.mouse.x = Math.round(( e.offsetX * 100 ) / e.target.clientWidth )
//   set.mouse.y = Math.round(( e.offsetY * 100 ) / e.target.clientHeight )
// })

// window.addEventListener('mouseup', e => {
//   clicked = false
//   set.mouse.x = 0
//   set.mouse.y = 0
// })

// mV.addEventListener('mousemove', e => {
//   if(clicked){
//     const x = Math.round(( e.offsetX * 100 ) / e.target.clientWidth )
//     const y = Math.round(( e.offsetY * 100 ) / e.target.clientHeight )
//     set.position.x -=  ( x - set.mouse.x ) * set.mouse.speed * set.scale
//     set.position.y -=  ( y - set.mouse.y ) * set.mouse.speed * set.scale
//     set.mouse.x = x
//     set.mouse.y = y
//     drawMap()
//   }
// })

// document.querySelectorAll(".buttons button").forEach( arr => {
//   arr.addEventListener('click', e => { 
//     if( "+" == e.target.innerText){
//       set.scale /= 2;
//     }

//     if( "-" == e.target.innerText){
//       set.scale *= 2;
//     }

//     if( "↓" == e.target.innerText){
//       set.position.y += 50 * set.scale;
//     }

//     if( "↑" == e.target.innerText){
//       set.position.y -= 50 * set.scale;
//     }

//     if( "←" == e.target.innerText){
//       set.position.x -= 50 * set.scale;
//     }

//     if( "→" == e.target.innerText){
//       set.position.x += 50 * set.scale;
//     }

//     drawMap()
//   })
// })


