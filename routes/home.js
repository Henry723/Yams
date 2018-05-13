var express = require('express');
var router = express.Router();
var db = require('../config/db');
var passport = require("../config/auth");
var Request = require('tedious').Request;

/* GET Home page. */
router.get('/', function(req, res, next) {
	res.render('home', { message: req.flash('error')});
});

/***login user and render dashboard****/
router.post('/auth/local/login',
		passport.authenticate('local-login', {
			successRedirect: '/fridge/getUserFoodData',
			failureRedirect: '/',
			failureFlash: true
}));

/***register user and render dashboard****/
router.post('/auth/local/register', function (req, res, next) {

    request = new Request("INSERT INTO users (name, email, password) VALUES ('" +
        req.body.name + "', '" + req.body.email + "', '" + req.body.password + "')",
        function (error)
        {
            if (error)
            {
                console.log(error.message);
                throw error;
            }
            else
            {
                console.log("login success");
                res.redirect("/");
            }
        }
    );
    db.execSql(request);

});

router.get('/auth/google', 
		passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email'] }));


router.get('/auth/google/callback',
		passport.authenticate('google', { failureRedirect: '/' }),
		function(req, res) {
			console.log('call back!');
			console.log('req.user: ', req.user)
			res.redirect('/fridge/getUserFoodData');
});

module.exports = router;