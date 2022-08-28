// REDIRECTING FROM HTTP TO HTTPS
if(location.host != "localhost:5000"){
  if(location.protocol == "http:"){
    console.log("REDIRECTING TO HTTPS");
    window.location.replace(location.href.replace("http","https"));
  }
}
// SERVICE WORKER
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('../serviceWorker.js')
// }