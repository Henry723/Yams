var express = require('express');
var router = express.Router();
var db = require('../config/db');
var passport = require("../config/authLocal");
var Request = require('tedious').Request;

/* GET Home page. */
router.get('/', function(req, res, next) {
	res.render('home', { message: req.flash('error')});
});

router.get('/login', 
		passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email'] }));


router.get('/login/callback',
		passport.authenticate('google', { failureRedirect: '/' }),
		function(req, res) {
			console.log('call back!');
			console.log('req.user: ', req.user)
			res.redirect('/fridge/getUserFoodData');
});

module.exports = router;
