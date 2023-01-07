const mV = document.querySelector("#mapViewer");
mV.style.cssText = `
  width:100%;
`

mV.width = 1000;
mV.height = 446;

const fullMapMin = new Image()
fullMapMin.src = '/img/page/fullmap.min.webp'
const ctx = mV.getContext('2d')

fullMapMin.addEventListener("load", e => {
  ctx.drawImage(fullMapMin, 0, 0, mV.width, mV.height);
});

const fullMap = new Image();
fullMap.src = '/img/page/fullmap.webp'

mV.addEventListener('click', e => {
  const x = Math.round(( e.offsetX * 100 ) / e.target.clientWidth )
  const y = Math.round(( e.offsetY * 100 ) / e.target.clientHeight )
  console.log({ x, y })
})