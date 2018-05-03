var express = require('express');
var router = express.Router();
var db = require('../db');

/***login user and render dashboard****/
router.post('/login', function (req, res, next) {

    db.query("SELECT ID FROM users WHERE email=" + JSON.stringify(req.body.email), function (error, result, field) {

        if (error) {
            console.log(error);
        }
        else {
            var json = JSON.parse(JSON.stringify(result)); 
            var userID = json[0].ID;

            db.query("SELECT foodName, daysLeft FROM usersFoodData WHERE ID=" + userID, function (error, result, fields) {

                json = JSON.parse(JSON.stringify(result));
                res.render('user', { json: json });
            });
        }
    });
});

/***register user and render dashboard****/
router.post('/register', function (req, res, next) {
    
	console.log(req.body);
    
    var register = {
    	"full_name": req.body.name,
    	"email": req.body.email,
    	"password": req.body.password
    }
    
    console.log(register);
    
    db.query("insert into users set ?", register, function(error) {
    	if (error) {
    		console.log(error.message);
    		throw error;
    	} else {
    		console.log("login success");
    	}
    });
    res.render('user');
});

/****ajax response****/
router.get('/allFoods', function (req, res, next) {
    /**Pass through foodReference data***/
    res.send(foods);
});

/*******adding food to fridge****/
router.post('/newFoodItem', function (req, res, next) {
});

/****delete item from fridge****/
router.delete("/:foodID", function (req, res, next) {

});

module.exports = router;
