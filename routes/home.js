var express = require('express');
var router = express.Router();
var db = require('../db');
var Request = require('tedious').Request;

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
            }
        }
    ); 
    db.execSql(request);

    db.request.on('requestCompleted', function () {
        db.login(req, res, next);
    });
});

module.exports = router;
