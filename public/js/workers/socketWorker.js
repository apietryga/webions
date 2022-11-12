onmessage = (e) => {
  console.log('Message received from main script');
  const workerResult = `Result: ${e.data[0] * e.data[1]}`;
  console.log('Posting message back to main script');
  postMessage(workerResult);
}

const socket = {
  init(){
    this.protocol = window.location.protocol == "https:" ? "wss:" : "ws:";
    this.ws = new WebSocket(this.protocol+"//"+window.location.host+"/fetch/?name="+player.name,'echo-protocol');
    this.ws.onopen = () => {this.connected = true;console.log("WS open.");}
    this.param.focus = true;
    window.onfocus = () => {this.param.focus = true;};
    window.onblur  = () => {this.param.focus = false;};
  },
}

socket.ws.onmessage = async msg => { 
  console.log({ msg })
  postMessage( { msg , wiadomosc: ' wiadomość dla ciebie :D'})

}