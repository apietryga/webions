// LOADER
const loader = document.createElement("div");
loader.className = "loader";

const imgField = document.createElement("div");
imgField.className = "imgField";
  const img = document.createElement("img");
  img.src = "/img/logo.webp";
  img.alt = game.name+" Game";
  imgField.append(img);
loader.append(imgField);

const h1 = document.createElement("h1");
h1.innerHTML = game.name;
loader.append(h1);

const loadProgress = document.createElement("div");
loadProgress.className = "loadProgress";
// if(location.pathname != "/game.html"){loadProgress.style.border = 0;}
if(location.pathname != "/game"){loadProgress.style.border = 0;}
  const progressBar = document.createElement("div");
  progressBar.className = "progressBar";
  loadProgress.append(progressBar);
loader.append(loadProgress);

const loadDetails = document.createElement("div");
loadDetails.className = "loadDetails";
loader.append(loadDetails);

document.body.prepend(loader);
