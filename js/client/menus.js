const menus = {
  gamePlane : document.querySelector(".gamePlane"),
  init(){
    // init buttons
    const div = document.createElement("div");
    div.innerHTML = "elo";
    div.style.cssText = `
      position:absolute;
      left:0;
      top:0;
      border:2px dashed red;
      z-index:1000;
    `;
    this.gamePlane.append(div);
    console.log("DZIAŁA?")


  }


}
menus.init();