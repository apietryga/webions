const webController = require('./controllers/webController')
const Router = require('express').Router
const public = require("./public");
const router = {
  call : Router(),
  set( obj ){ this[Object.keys(obj)] = obj[Object.keys(obj)] }
}

// router.call.route('*').post( (req,res) => { public(req,res, router.cm, router.dbconnect) });
router.call.route(['/','/index.html']).get( webController.index );
router.call.route('/libary.html').get( webController.libary );
router.call.route('/mapeditor.html').get( webController.mapeditor );
router.call.route('/4devs.html').get( webController['4devs'] );
router.call.route('/players.html').get( webController.players );
router.call.route('/exportplayers.html').get( webController.exportplayers );
router.call.route('/game.html').get( webController.game );
router.call.route('/account.html').get( webController.account );


module.exports = router
