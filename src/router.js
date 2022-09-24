const webController = require('./controllers/webController')
const Router = require('express').Router
const public = require("./public");
const router = {
  call : Router(),
  set( obj ){ this[Object.keys(obj)] = obj[Object.keys(obj)] }
}

router.call.route('/test').get( webController.test );
// router.call.route('*').get( (req,res) => { public(req,res, router.cm, router.dbconnect) });
router.call.route('*').post( (req,res) => { public(req,res, router.cm, router.dbconnect) });
router.call.route(['/','/index.html']).get( webController.index );


module.exports = router
