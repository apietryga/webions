const menus = {
  gamePlane : document.querySelector(".gamePlane"),
  init(){
    // init buttons
    const div = document.createElement("div");
    // div.innerHTML = "outfit";
    div.innerHTML = "o";
    const x = (this.gamePlane.clientWidth - gamePlane.canvas.clientWidth)/2;
    const y = this.gamePlane.clientHeight/4;
    div.style.cssText = `
      position:absolute;
      border:2px dashed red;
      left:`+x+`px;
      top:`+y+`px;
      `;
    this.gamePlane.append(div);
    div.onclick = () => {
      this.menu("outfit");
    }
  },
  menu(which){
    if(which == "outfit"){
      console.log("CHANGE OUTFIT");

    }
  }


}
// menus.init();