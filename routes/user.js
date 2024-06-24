const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../midlewarelogin.js');
const {wanderlustSignup , signupfrom ,loginForm ,wanderlustlogin ,wanderlustlogout} = require('../contorolles/user.js');


router.route('/signup')
.get(signupfrom)
.post(wrapAsync(wanderlustSignup))

router.route('/login')
.get(loginForm)
.post(saveRedirectUrl, passport.authenticate('local',{failureRedirect : '/login' , failureFlash:true}), wanderlustlogin)

router.get('/logout' , wanderlustlogout)

module.exports = router;


