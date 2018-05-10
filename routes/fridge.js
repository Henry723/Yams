var express = require('express');
var router = express.Router();
var db = require('../config/db');
var authLocal = require('../config/authLocal');
var Request = require('tedious').Request;

/****Redirect to userdashboard - so messy ahhhh****/
router.get('/login', function(req, res, next){
  db.getUserFoodData(req, res, next);
});

/***login user and render dashboard****/
router.post('/login',
		authLocal.authenticate('local-login', {
			successRedirect: './getUserFoodData',
			failureRedirect: '../'
		}));

router.get('/getUserFoodData', function(req, res, next) {
	db.getUserFoodData(req, res, next);
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
        db.getUserFoodData(req, res, next);
    });
});

/****Get all food reference table****/
router.get('/allFoods', function (req, res, next) {
    /**Pass through foodReference data***/
    var foods;

    request = new Request("SELECT * FROM foodReference", function (error, rowCount, rows) {
        if (error) {
            console.log(error);
        }
        else {
            foods = rows
            res.send({ foods: foods });
        }
    }
    );

    db.execSql(request);
});

/*******adding multiple foods to kitchen ****/
router.post('/addFoodItems', function (req, res, next) {
    // get userID and food info and store them into array.
	console.log("addfooditems: ", req.user);
    var foods = [];

    if (typeof req.body.foodName === 'string') {
        foods.push([
            req.user.email,
            req.body.foodName,
            req.body.expiryDate]);
    }
    else {
        for (var i = 0; i < req.body.foodName.length; i++) {
            foods.push([
                req.user.email,
                req.body.foodName[i],
                req.body.expiryDate[i]]);
        }
    }
    var sql = "(";
    for (var i = 0; i < foods.length; i++) {
        sql += "'" + foods[i][0] + "'"; //email
        sql += ", ";
        sql += "'" + foods[i][1] + "'"; //food name
        sql += ", ";
        sql += "'" + foods[i][2] + "')"; //daysLeft (for now)

        if (i != foods.length - 1) {
            sql += ", (";
        }
    }

    // insert food info into database.
    request = new Request("INSERT INTO usersFoodData(email, foodName, daysLeft) VALUES " + sql , function (error) {
        if (error) {
            console.log(error.message);
            throw error;
        }
        else {
            console.log("addition success");
        }
    });

    db.execSql(request);

    request.on('requestCompleted', function () {
        db.getUserFoodData(req, res, next);
    });
});

router.post('/addSingleItem', function (req, res, next) {

    console.log("entered");
    var dateInstance = new Date();
    var currentDateStr = "" + dateInstance.getFullYear() + "-0" + (dateInstance.getMonth() + 1) + "-0" + dateInstance.getDate();

    var designatedDate = new Date(req.body.expiryDate);
    var currentDate = new Date(currentDateStr);

    const ONE_DAY = 1000 * 60 * 60 * 24;

    var daysLeft = (designatedDate - currentDate) / ONE_DAY;

    var foodName = req.body.food;
    var date = req.body.expiryDate;

    request = new Request("INSERT INTO usersFoodData (email, foodName, daysLeft) VALUES" + "('" + req.user.email + "', '"
        + foodName.toUpperCase() + "', '" + daysLeft + "')",

        function (err, rowCount, rows) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("data added");
            }
        });
    db.execSql(request);

    request.on("requestCompleted", function () {
        res.redirect('/fridge/login');
    });
});

/****delete item from fridge****/
router.delete('/delete', function (req, res, next) {

    var foodName = req.body.food.trim();
    request = new Request("DELETE FROM usersFoodData WHERE email=" + "'" + req.user.email + "'"
        + " AND" + " foodName=" + "'" + foodName + "'",

        function (err, rowCount, rows) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("data deleted");
            }
        });
    db.execSql(request);
    res.end();
});

module.exports = router;
