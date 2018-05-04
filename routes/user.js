var express = require('express');
var router = express.Router();
var db = require('../db');

/***login user and render dashboard****/
router.post('/login', function (req, res, next) {

    db.query("SELECT ID,full_name FROM users WHERE email=" + JSON.stringify(req.body.email), function (error, result, field) {

        if (error) {
            console.log(error);
        }
        else {
            var json = JSON.parse(JSON.stringify(result));
            console.log(json);
            var userID = json[0].ID;
            var userName = json[0].full_name;
            req.session.userID = userID;
            req.session.userName = userName;
            db.query("SELECT foodName, daysLeft FROM usersFoodData WHERE ID=" + userID, function (error, result, fields) {
                json = JSON.parse(JSON.stringify(result));
                res.render('user', { json: json, userName: userName });
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
    var foods;
    db.query("SELECT * FROM foodReference", function(error, result, fields){
      if (error){
        console.log(error);
      } else {
        foods = JSON.parse(JSON.stringify(result));
        res.send({ foods: foods});
      }
    });
});

/*******adding food to fridge ****/
router.post('/addFoodItems', function (req, res, next) {
	
	// get userID and food info and store them into array.
	var foods = [];
	for (var i = 0; i < req.body.foodName.length; i++) {
		foods.push([
			req.session.userID,
			req.body.foodName[i],
			req.body.expiryDate[i]]);
	};
	
	// insert food info into database.
	db.query("insert into usersFoodData (ID, foodName, daysLeft) values ?",
			[foods], function(error) {
		if (error) {
    		console.log(error.message);
    		throw error;
    	} else {
    		console.log("addition success");
    	}
	});
	
	// redirect user into their dash board.
	res.render('user', {userName: req.session.userName});
	
});

/****delete item from fridge****/
router.delete("/:foodID", function (req, res, next) {

});

module.exports = router;
