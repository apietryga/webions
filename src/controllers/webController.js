module.exports = webController = {
  test(req, res){
    res.send("Test.")
  },
  index(req, res){
    res.render("index.njk", { variable: 'testingVariable' });
  }
}