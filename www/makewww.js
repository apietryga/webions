const fs = require('fs');
const path = "./www/";
const makewww = (callback) => {
  fs.readFile(path+'template.html', "utf8",( e , template) => {
    fs.readFile(path+'contents.html', "utf8",( e , content) => {
      for(const c of content.split("<!-- ")){
        const cc = c.split(" -->");
        const title = cc[0];
        if(title==""){continue;}
        const cont = cc[1];
        let data = template.replace("{{CONTENT}}", cont);
        fs.writeFile(path+title+'.html', data,(e)=>{
          console.log("Page "+title+" is done.")
        });        
      }
    })
  })
  callback();
}
module.exports = makewww;