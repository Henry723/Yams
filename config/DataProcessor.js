var express = require('express');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var nodemailer = require('nodemailer');

var config =
{
    userName: 'yamsAdmin',
    password: 'yamsRoot1234',
    server: 'yamssserver.database.windows.net',
    options:
    {
        database: 'yamsDB',
        encrypt: true,
        rowCollectionOnRequestCompletion: true
    }
};

var connection = new Connection(config);
connection.on
(
    'connect'
    , function (err)
      {
          if (err)
          {
              console.log(err);
          }
          else
          {
             console.log("Database server connected");
          }
      }
);

// notification
connection.setupNodemailer = function()
{
    let transporter = nodemailer.createTransport
    (
        {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth:
            {
                type: 'OAuth2',
                user: 'yamsreminder@gmail.com',
                clientId: '982036972753-412l3t38hu5mheodvmefeku43g7aal15.apps.googleusercontent.com',
                clientSecret: 's6MYWNgOuQndAQaJ5NKTqpsO',
                refreshToken: '1/oozVuK4LTwJxp7WpPasAyLIgLJea9tEhl7muZZLOUO4',
                accessToken: 'ya29.Glu4BfMJtwbsFCtBO1nuvOK_lUxR5s8N0ErkyWQmGWp0D6zna3kShxWFC4_9PwAE3g8vtY_9vykjazccFTMN8EKIvUyys7KahA4Rk1_LGTUYnwbUskDb7tpM3t4D'
            }
        }
    );
    return transporter;
}

connection.checkForAlarms = function ()
{
    var transporter = connection.setupNodemailer();
    var users;

    request = new Request
    (
        "SELECT * FROM users"
        , function (error, rowCount, rows)
          {
              if (error)
              {
                  console.log("REQUEST1 FAIL: " + error);
              }
              else
              {
                  console.log("request1 successfully reached."); users = rows;
              }
          }
    );
    connection.execSql(request);

    request.on
    (
        'requestCompleted'
        , function ()
          {
              var emailCount = 0;
              var sendMail = function (i)
              {
                  console.log("Total Users: " + users.length);

                  if (i < users.length)
                  {
                      var alarm = users[i][3].value;

                      if (!alarm)
                      {
                          alarm = 7;
                      }

                      var userEmail = users[i][0].value;

                      request = new Request
                      (
                          "SELECT * from usersFoodData WHERE email='" + userEmail + "'AND isNotified=0 AND daysLeft<='" + alarm + "'"
                          , function (error, rowCount, rows)
                            {
                                if (error)
                                {
                                    console.log("REQUEST2 FAIL:" + error);
                                }
                                else
                                {
                                    console.log("request2 successfully reached.");
                                    console.log(rows.length);

                                    if (rows.length > 0)
                                    {
                                        var foods = rows;
                                        var text = "";
                                        var html = "<head><style>body {background-color: rgb(245,245,245);}h1 {text-align: center;font-family: 'Fredoka One';}"
                                        + "#main {margin:0 auto;width: 70%;background-color: rgb(255,255,255);}#header{text-align: center;background-color:rgb(240, 248, 255);}"
                                        + "#content {padding : 30px;}#header{padding : 30px;}a {text-decoration: none;text-transform: uppercase;color: white;}a:visited {color: white;}button{background-color: cadetblue;border: none;color: white;padding: 15px 32px;margin: 0 auto;display: block;"
                                        + "text-align: center;text-decoration: none;font-size: 16px;cursor: pointer;margin:0 auto;}#main {font-family: 'Bree Serif', serif;}"
                                        + "table{margin:0 auto;padding: 16px 40px;border-style:solid;}tr, td {padding: 5px 60px;}</style><link href='https://fonts.googleapis.com/css?family=Fredoka+One'"
                                        + "rel='stylesheet'><link href='https://fonts.googleapis.com/css?family=Bree+Serif' rel='stylesheet'></head><body><h1>YAMS</h1><div id='main'><div id='header'>"
                                        + "<p style='font-size:20px'>YOUR FOOD IS EXPIRING SOON!</p><p>We want you to check your fridge</p><table><tr><th>Food</th></tr>"
                                        var expiringFood = "";
                                        for (var i = 0; i < foods.length; i++)
                                        {
                                            text += foods[i][0].value + " \r\n";
                                            expiringFood += "<tr><td>" + foods[i][0].value + "</td></tr>";
                                        }
                                        html += expiringFood + "</table></div><div id='content'><button><a href='https://calm-caverns-80656.herokuapp.com'>Check your fridge</a></button></div></div></body>"

                                        let mailOptions =
                                        {
                                            from: '"Your Friends At Yams" <yamsreminder@gmail.com>', // sender address
                                            to: userEmail + ', Adamsmith6300@gmail.com', // list of receivers
                                            subject: 'Gotta Eat up!', // Subject line
                                            text: 'Your foods are expiring! ' + text, // plain text body
                                            html: html // html body
                                        };

                                        transporter.sendMail
                                        (
                                            mailOptions
                                            , (error, info) =>
                                              {
                                                  if (error)
                                                  {
                                                  return console.log(error);
                                                  }

                                                  console.log('Message sent: %s', info.messageId);
                                                  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                                              }
                                        );
                                    }
                                }
                            }
                      );
                      connection.execSql(request);

                      request.on
                      (
                          "requestCompleted"
                          , function ()
                            {
                              request = new Request("UPDATE usersFoodData SET isNotified=1 WHERE email='" + userEmail + "'AND isNotified=0 AND daysLeft<='" + alarm + "'"
                                  , function (error, rowCount, rows){
                                     if (error){
                                       console.log(error);
                                     } else {
                                       console.log("Users food data updated.");
                                     }
                                   });
                                connection.execSql(request);
                                request.on ("requestCompleted", function(){
                                  i++;
                                  /*****dash of es6 ;) *****/
                                  console.log(`Request2 Complete: (${i})`);
                                  sendMail(i);
                                });
                            });
                  }
                  else
                  {
                      connection.updateDaysLeft();
                  }
              }
              var i = 0;
              sendMail(i);
          }
    );
}

// fridge
connection.getUserFoodData = function (req, res, next)
{
    getUserFoodDataRequest = new Request
    (
        "SELECT foodName, daysLeft FROM usersFoodData WHERE email=" + "'" + req.user.email + "'"
        , function (err, rowCount, rows)
          {
              if (err)
              {
                  console.log(err);
              }
              else
              {
                  var usersFood = rows;
                  rows.sort
                  (
                      function (a, b)
                      {
                          if (a[1].value > b[1].value)
                          {
                              return 1;
                          }
                          else if (a[1].value == b[1].value)
                          {
                              return 0;
                          }
                          return -1;
                      }
                  );

                  res.render('fridge', { usersFood: usersFood, userName: req.user.name
                      , alarm: req.user.alarm, message: req.flash('info') } );
              }
          }
    );
    connection.execSql(getUserFoodDataRequest);
}

connection.updateDaysLeft = function ()
{
    updateRequest = new Request
    (
        "UPDATE usersFoodData SET daysLeft=daysLeft - 1"
        , function (error)
          {
              if (error)
              {
                  console.log(error);
              }
          }
    );
    connection.execSql(updateRequest);
}

connection.calculateDaysLeft = function (designatedDate)
{
    var dateInstance = new Date();

    var currentDateStr = "" + dateInstance.getFullYear();
    currentDateStr += (dateInstance.getMonth() + 1) >= 10 ? "-" + (dateInstance.getMonth() + 1) :
        "-0" + (dateInstance.getMonth() + 1);
    currentDateStr += dateInstance.getDate() >= 10 ? "-" + dateInstance.getDate() :
        "-0" + dateInstance.getDate();

    var currentDate = new Date(currentDateStr);

    const ONE_DAY = 1000 * 60 * 60 * 24;
    var daysLeft = (designatedDate - currentDate) / ONE_DAY;
    var dateObject = { "daysLeft": daysLeft, "currentDateStr": currentDateStr };

    return dateObject;
}

module.exports = connection;
