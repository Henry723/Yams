var express = require('express');
var router = express.Router();
var dataProcessor = require('../config/DataProcessor');
var passport = require("../config/Auth");
var Request = require('tedious').Request;

/* GET Home page. */
router.get
(
    '/'
    , function (req, res, next)
    {
        res.render('home', { message: req.flash('error')});
    }
);

router.post
(
    '/Auth/local/login'
    , passport.authenticate
      (
          'local-login'
        , { successRedirect: '/fridge/dashboard', failureRedirect: '/', failureFlash: true }
      )
);

router.post
(
    '/Auth/local/register'
    , passport.authenticate
      (
          'local-register'
        , { successRedirect: '/fridge/dashboard', failureRedirect: '/', failureFlash: true }
      )
);


router.get
(
    '/Auth/google'
    , passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email']})
);


router.get
(
    '/Auth/google/callback'
    , passport.authenticate('google', { failureRedirect: '/' })
    , function (req, res)
      {
          console.log('call back!');
	      console.log('req.user: ', req.user)
          res.redirect('/fridge/dashboard');
      }
);

module.exports = router;
