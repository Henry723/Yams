var express = require('express');
var router = express.Router();
var db = require('../config/DataProcessor');
var Request = require('tedious').Request;
var nodemailer = require('nodemailer');

router.get
(
    '/dashboard'
    , function (req, res, next)
      {
          DataProcessor.getUserFoodData(req, res, next);
      }
);

/****Get all food reference table****/
router.get
(
    '/allFoods'
    , function (req, res, next)
      {
          /**Pass through foodReference data***/
          var foods;

          request = new Request
          (
              "SELECT * FROM foodReference"
              , function (error, rowCount, rows)
                {
                    if (error)
                    {
                        console.log(error);
                    }
                    else
                    {
                        foods = rows; res.send({ foods: foods });
                    }
                }
          );
          DataProcessor.execSql(request);
      }
);

/*******adding multiple foods to kitchen ****/
router.post
(
    '/addFoodItems'
    , function (req, res, next)
      {
          // get userID and food info and store them into array.
          var foods = [];

          if (typeof req.body.foodName === 'string')
          {
              var dateObject = DataProcessor.calculateDaysLeft(new Date(req.body.expiryDate));
              foods.push([req.user.email, req.body.foodName, dateObject.currentDateStr
                  , req.body.expiryDate, dateObject.daysLeft, 0]);
          }
          else
          {
              for (var i = 0; i < req.body.foodName.length; i++)
              {
                  var dateObject = DataProcessor.calculateDaysLeft(new Date(req.body.expiryDate[i]));

                  foods.push([ req.user.email, req.body.foodName[i], dateObject.currentDateStr,
                      req.body.expiryDate[i], dateObject.daysLeft, 0 ]);
              }
          }

          var sql = "(";
          for (var i = 0; i < foods.length; i++)
          {
              sql += "'" + foods[i][0] + "'"; //email
              sql += ", ";
              sql += "'" + foods[i][1] + "'"; //food name
              sql += ", ";
              sql += "'" + foods[i][2] + "'"; //dayIn
              sql += ", ";
              sql += "'" + foods[i][3] + "'"; //dayOut
              sql += ", ";
              sql += "'" + foods[i][4] + "'"; //daysLeft
              sql += ", ";
              sql += "'" + foods[i][5] + "')"; //isNotified

              if (i != foods.length - 1)
              {
                  sql += ", (";
              }
          }

          // insert food info into database.
          request = new Request
          (
              "INSERT INTO usersFoodData(email, foodName, dayIn, dayOut, daysLeft, isNotified) VALUES " + sql
              , function (error)
                {
                    if (error)
                    {
                        console.log(error.message); throw error;
                    }
                    else
                    {
                        console.log("addition success");
                    }
                }
          );

          DataProcessor.execSql(request);

          request.on
          (
              'requestCompleted'
              , function ()
                {
                    req.flash('info', 'Items are added');
                    res.redirect('/fridge/dashboard');
                }
          );
    }
);

router.post
(
    '/addSingleItem'
    , function (req, res, next)
      {
          var foodName = req.body.food.slice(0, 1).toUpperCase() + req.body.food.slice(1, req.body.food.length).toLowerCase();
          var dateObject = DataProcessor.calculateDaysLeft(new Date(req.body.expiryDate));

          request = new Request
          (
              "INSERT INTO usersFoodData (email, foodName, daysLeft, isNotified) VALUES" + "('" + req.user.email + "', '"
                  + foodName + "', '" + dateObject.daysLeft + "', 0)"
              , function (err, rowCount, rows)
                {
                    if (err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        console.log("data added");
                    }
                }
          );
          DataProcessor.execSql(request);

          request.on
          (
              "requestCompleted"
              , function ()
                {
                    DataProcessor.execSql
                    (
                        new Request
                        (
                            "UPDATE usersFoodData SET dayIn=" + "'" + dateObject.currentDateStr + "', "
                                + "dayOut=" + "'" + req.body.expiryDate + "'" + " WHERE email=" + "'" + req.user.email + "'"
                                + " AND foodName=" + "'" + req.body.food + "'"
                            , function (err)
                              {
                                  if (err)
                                  {
                                      console.log(err);
                                  }
                                  else
                                  {
                                      req.flash('info', 'Item is added');
                                      res.redirect('/fridge/dashboard');
                                  }
                              }
                          )
                      );
                  }
          );
      }
);

/****delete item from fridge****/
router.delete
(
    '/delete'
    , function (req, res, next)
      {
          var foodName = req.body.food;

          request = new Request
          (
              "DELETE FROM usersFoodData WHERE email=" + "'" + req.user.email + "'"
              + " AND" + " foodName=" + "'" + foodName + "'"
              , function (err, rowCount, rows)
                {
                    if (err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        console.log("data deleted");
                    }
                }
          );

          DataProcessor.execSql(request);
          res.end();
      }
);

router.post
(
    '/notificationSet'
    , function (req, res, next)
      {
          var alarm = req.body.days <= 0 ? 1 : req.body.days;

          DataProcessor.execSql
          (
              new Request
              (
                  "UPDATE users SET alarm=" + alarm + "WHERE email=" + "'" + req.user.email + "'"
                  , function (error)
                    {
                        if (error)
                        {
                            console.log(error);
                        }
                        else
                        {
                            console.log("alarm set"); res.redirect('/fridge/dashboard');
                        }
                    }
              )
          );
      }
);

router.get
(
    '/logout'
    , function (req, res)
      {
          req.logout();
          res.redirect('../');
      }
);

module.exports = router;
