// BG IMAGES
setInterval(()=>{
  const bgs = document.querySelectorAll('.background img');
  for(const [index, img] of bgs.entries()){
    if(img.classList.contains('active')){
      bgs[index < bgs.length - 1 ? index + 1 : 0 ].classList.add('active')
      img.classList.remove('active')
      break
    }
  }
},15000)

const acc = {
  // hideLoader:true,
  urlVals:'login',
  init(){
    this.formPicker();
    this.messDisplayer();
    for(const submit of document.querySelectorAll("input[type=submit]")){
      submit.addEventListener("click",this.formValidator);
    }
    // if(this.hideLoader){
    //   document.querySelector(".loader").style.display = "none";
    // }
  },
  formPicker(){
    // FORM PICKER [from URL]
    let isForm = false;
    // let urlVals;    
    if(action == "game"){
      acc.hideLoader = false;
      document.cookie = "token={{ token | safe }}; SameSite=None; Secure";
      window.location.replace("game.html");
    }
    if(action == "logout"){
      for(const cookie of document.cookie.split(";")){
        const c = cookie.split("=");
        if(c[0] == "token"){
          document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      }
      // window.location.replace("/account.html?action=login");
      window.location.replace("/acc/login");

    }
    // {# if(action != "{{act"+"ion}}" && action != ""){ #}
    if( action != ""){
      this.urlVals = action;
    }else{
      this.urlVals = window.location.search.split(/=|&/);
    }
    
    for(const f of document.querySelectorAll("form")){
      if(this.urlVals.includes(f.id)){
        f.style.display = "flex";
        isForm = true;
      }
    }
    //if(!isForm){
    //  document.querySelector("#login").style.display = "flex";
    //}

  },
  messDisplayer(){
    // MESSAGE DISPLAYER
    const message = document.querySelector(".message");
    if(message.innerHTML == "" || this.urlVals == "result" || action == "game" ){
      message.innerHTML = "";
    }
    // {# if("{{nick}}" != "" && "{{nick}}" != "{{ni"+"ck}}" ){ #}
    // if("{{nick}}" != "" ){
    if(nick != "" ){
      for(const nickField of document.querySelectorAll(".nick > input")){
        // nickField.value = "{{nick}}";
        nickField.value = nick;
      }
    }
  },
  formValidator(e){
    // FORM VALIDATOR
    let valid = true;
    let isRadio = false;
    // let action = false;
    let message = "";
    let radioValue;
    // get current form
    for(const form of document.querySelectorAll("form")){
      console.log(form.parentElement.parentElement)
      //if(form.style.display == "flex"){
      if(form.parentElement.parentElement.style.display == "flex"){
        // get all inputs
        for(const input of form.querySelectorAll("input")){
          input.style.outline = "none";
          if(["text","password"].includes(input.type)){
            if(input.value == ""){
              valid = false;
              message = "Fill up all fields.";
              input.style.border = "2px solid red";
            }
          }
          if(input.name == "email"){
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(!re.test(String(input.value).toLowerCase())){
              valid = false;
              message = "Re-type your real email adress. It'll be helpful when you forget your pass.";
              input.style.border = "2px solid red";
            }
          }
          if(input.type == "radio"){
            isRadio = true;
            if(input.checked == true){
              radioValue = input.value;
            }
          }
          if(input.name == "passToken"){
            input.value = window.location.search.split("passToken=")[1];
          }
        }
        // check radio input
        for(const input of form.querySelectorAll("input")){
          if(input.type == "radio" && !isSet(radioValue) && isRadio){
            input.style.outline = "2px solid red";
            valid = false;
          }
        }
      }
    }
    if(message != ""){
      const messField = document.querySelector(".message");
      messField.innerHTML = "<b style='color:red;'>"+message+"</b>";
      messField.style.display = "flex";
    }
    if(!valid){
      e.preventDefault();
    }
  }
}
acc.init();

// dynamic forms changing
const UX = { 
  init(){
    document.querySelectorAll('.btn').forEach(btn => {
      if(btn.innerText === 'Cancel'){
        btn.addEventListener('click', UX.buttons.cancel)
      }
    })

  },
  buttons: {
    cancel( e ){
      e.preventDefault();
      console.log('JU SIUR ?')
    }

  }


}
UX.init();