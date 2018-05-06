var express = require('express');
var router = express.Router();
var db = require('../db');

/* GET Home page. */
router.get('/', function(req, res, next) {
  res.render('home');
});

/****Redirect to userdashboard - so messy ahhhh****/
router.get('/login', function(req, res, next){
  req.body.email = req.session.email;
  db.login(req, res, next);
});

/***login user and render dashboard****/
router.post('/login', function(req, res, next){
  db.login(req, res, next);
});

/***register user and render dashboard****/
router.post('/register', function (req, res, next) {

    var register = {
    	"full_name": req.body.name,
    	"email": req.body.email,
    	"password": req.body.password
    }

    db.query("insert into users set ?", register, function(error) {
    	if (error) {
    		console.log(error.message);
    		throw error;
    	} else {
    		console.log("login success");
    	}
    });
    db.login(req, res, next);
});

module.exports = router;
