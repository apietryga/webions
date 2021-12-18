// REDIRECTING FROM HTTP TO HTTPS
if(location.host != "localhost"){
  if(location.protocol == "http:"){
    console.log("REDIRECTING TO HTTPS");
    window.location.replace(location.href.replace("http","https"));
  }
}