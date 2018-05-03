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

                res.render('user', JSON.parse(JSON.stringify(result)), function (err, html) {
                    console.log("The user's food data sent");
                    console.log(JSON.parse(JSON.stringify(result)));
                 });
            });
        }
    });
});

/***register user and render dashboard****/
router.post('/register', function (req, res, next) {
    console.log(req.body.email);
    res.render('user');
});

/****ajax response****/
router.get('/allFoods', function (req, res, next) {
    /**Pass through foodReference data***/
    res.send(foods);
});

/*******adding food to fridge****/
router.post('/newFoodItem', function (req, res, next) {
})

/****delete item from fridge****/
router.delete("/:foodID", function (req, res, next) {

})


module.exports = router;
