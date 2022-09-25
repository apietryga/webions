const webController = require('./controllers/webController')
const authController = require('./controllers/authController')
require('express-group-routes');
const Router = require('express').Router
const router = {
  call : Router(),
  set( obj ){ this[Object.keys(obj)] = obj[Object.keys(obj)] }
}
router.call.route(['/','/index.html']).get( webController.index );
router.call.route('/4devs.html').get( webController['4devs'] );
router.call.route('/game.html').get( webController.game );
router.call.route('/account.html').get( webController.account );
router.call.group("/libary", router => {
  router.get([
    "/",
    "/about",
    "/install",
    "/controls",
    "/items",
    "/monsters",
  ], webController.libary)
})
router.call.group("/players", router => {
  router.get([
    '/',
    '/level',
    '/fist',
    '/dist',
    '/def',
    '/magic',
    '/online',
    '/lastdeaths'
  ], webController.players)
})
router.call.route('/account.html').post( authController.account );
router.call.route('*').get( (req,res) => { 
  res.render('template.njk', { ...webController.vals, page: '404' })
});


module.exports = router
