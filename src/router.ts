import webController from './controllers/webController';
import authController from './controllers/authController';
import { Router } from 'express';
require('express-group-routes');

const router: any = {
  call : Router(),
  set( obj:any ){ 
    for(const key in obj){
      this[key] = obj[key]
    }
  }
}

router.call.route(['/','/index.html']).get( webController.index );
router.call.route('/4devs.html').get( webController['4devs'] );
router.call.route('/game').get( webController.game );
router.call.route('/game').post( authController.login );
// router.call.route('/game/get-map').get( webController.gameMap );

router.call.group('/libary', (router:any) => { router.get([
  "/",
  "/about",
  "/install",
  "/controls",
  "/items",
  "/monsters",
], webController.libary) })
router.call.group('/players', (router:any) => { router.get( [
  '/',
  '/level',
  '/fist',
  '/dist',
  '/def',
  '/magic',
  '/online',
  '/lastdeaths'
], webController.players)})
router.call.route('/player/:player').get( webController.player );
router.call.group('/acc', (router:any) => {
  router.get('/logout', authController.logout )
  router.get('*', authController.home )
  router.post('/login', authController.login )
  router.post('/register', authController.register )
  router.post('/forgot', authController.forgot )
  router.post('/forgot/newpass', authController.forgot )
})
router.call.route('*').get( ( req:any, res:any ) => { 
  res.render('template.njk', { ...webController.vals, page: '404' })
});

export default router
