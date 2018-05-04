var express = require('express');
var router = express.Router();
var db = require('../db');

/****so messy ahhhh****/
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

    console.log(register);

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
  // db.query("SELECT foodName, daysLeft FROM usersFoodData WHERE ID=" + req.session.userID, function (error, result, fields) {
  //     usersFood = JSON.parse(JSON.stringify(result));
  //     res.render('user', { usersFood: usersFood, userName: req.session.userName });
  // });
  req.body.email = req.session.email;
  db.login(req, res, next);

});

/****delete item from fridge****/
router.delete("/:foodID", function (req, res, next) {

});

module.exports = router;
