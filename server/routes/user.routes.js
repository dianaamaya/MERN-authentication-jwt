const router = require("express").Router();
const passport = require('passport');

//config
const passportConf = require('../config/passport');

//Helpers
const { validateBody, schemaSignUp, schemaSignIn } = require('../helpers/routeHelpers');

//Controllers
const {signUp, 
    signIn, 
    signOut, 
    googleOAuth, 
    linkGoogle, 
    unlinkGoogle, 
    facebookOAuth, 
    linkFacebook,
    unlinkFacebook,
    dashboard,
    checkAuth } = require("../controllers/user.controller");

//User routes

//to register the user: 
//1- validate form parameters. 
//2- call the controller.
router.post("/user/signup", 
    validateBody(schemaSignUp), 
    signUp);

//to login the user:
//1- validate form parameters. 
//2- check the passport local strategy. 
//3- call the controller.
router.post("/user/signin", 
    validateBody(schemaSignIn), 
    passport.authenticate('local', {session:false}), 
    signIn);

//to log out the user:
//1- check the passport jwt strategy. 
//2- call the controller.
router.get("/user/signout",
    passport.authenticate('jwt', { session: false }), 
    signOut);

//to login/register the user by google:
//1- check the passport googleToken strategy. 
//2- call the controller.    
router.post("/user/oauth/google",
    passport.authenticate('googleToken', { session: false }), 
    googleOAuth);

//to link the google account to the local account:
//1- check the passport jwt strategy. 
//2- check the passport googleToken strategy. 
//3- call the controller.    
router.post("/user/oauth/link/google",
    passport.authenticate('jwt', { session: false }), 
    passport.authorize('googleToken', { session: false }), 
    linkGoogle);

//to unlink the google account from the local account:
//1- check the passport jwt strategy.  
//2- call the controller.   
router.post("/user/oauth/unlink/google",
    passport.authenticate('jwt', { session: false }), 
    unlinkGoogle);

//to login/register the user by facebook:
//1- check the passport facebookToken strategy.  
//2- call the controller.  
router.post("/user/oauth/facebook",
    passport.authenticate('facebookToken', { session: false }), 
    facebookOAuth);

//to link the facebook account to the local account:
//1- check the passport jwt strategy.  
//2- check the passport facebookToken strategy.  
//3- call the controller. 
router.post("/user/oauth/link/facebook",
    passport.authenticate('jwt', { session: false }), 
    passport.authorize('facebookToken', { session: false }), 
    linkFacebook);

//to unlink the facebook account from the local account:
//1- check the passport jwt strategy.   
//2- call the controller.
router.post("/user/oauth/unlink/facebook",
    passport.authenticate('jwt', { session: false }), 
    unlinkFacebook);

//to link get methods and secret:
//1- check the passport jwt strategy.   
//2- call the controller.
router.get("/user/dashboard",
    passport.authenticate('jwt', { session: false }), 
    dashboard);

//to check user status:
//1- check the passport jwt strategy.   
//2- call the controller.
router.get("/user/status",
    passport.authenticate('jwt', { session: false }), 
    checkAuth);

//export the mudule
module.exports = router;