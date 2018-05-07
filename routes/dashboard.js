var express = require('express');
var router = express.Router();
var db = require('../db');

/****Get all food reference table****/
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

/*******adding multiple foods to kitchen ****/
router.post('/addFoodItems', function (req, res, next) {
	// get userID and food info and store them into array.
	var foods = [];
	for (var i = 0; i < req.body.foodName.length; i++) {
		foods.push([
			req.session.email,
			req.body.foodName[i],
			req.body.expiryDate[i]]);
	};
	// insert food info into database.
	db.query("insert into usersFoodData (email, foodName, daysLeft) values ?",
			[foods], function(error) {
		if (error) {
    		console.log(error.message);
    		throw error;
    	} else {
    		console.log("addition success");
    	}
	});
  req.body.email = req.session.email;
  db.login(req, res, next);
});

/****delete item from fridge****/
router.delete('/delete', function (req, res, next) {
    var foodName = req.body.food.trim();
    db.query("DELETE FROM usersFoodData WHERE email=" + JSON.stringify(req.session.email)
        + " AND" + " foodName=" + JSON.stringify(foodName));
});

module.exports = router;
