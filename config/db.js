﻿var express = require('express');
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

connection.setupNodemailer = function(){
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: 'yamsreminder@gmail.com',
        clientId: '982036972753-412l3t38hu5mheodvmefeku43g7aal15.apps.googleusercontent.com',
        clientSecret: 's6MYWNgOuQndAQaJ5NKTqpsO',
        refreshToken: '1/oozVuK4LTwJxp7WpPasAyLIgLJea9tEhl7muZZLOUO4',
        accessToken: 'ya29.Glu4BfMJtwbsFCtBO1nuvOK_lUxR5s8N0ErkyWQmGWp0D6zna3kShxWFC4_9PwAE3g8vtY_9vykjazccFTMN8EKIvUyys7KahA4Rk1_LGTUYnwbUskDb7tpM3t4D'
    }
  });
  return transporter;
}

connection.checkForAlarms = function(){
  var transporter = connection.setupNodemailer();
  var users;
  request = new Request("SELECT * FROM users", function (error, rowCount, rows) {
    if (error) {
      console.log(error);
    }
    else {
      console.log("request1");
      users = rows;
    }
  });
  connection.execSql(request);
  request.on('requestCompleted', function () {
      var sendMail = function(i){
        console.log("user length " + users.length);
        console.log("First I " + i);
        if (i < users.length){
          var alarm = users[i][3].value;
          var userEmail = users[i][0].value;
          request = new Request("SELECT * FROM usersFoodData WHERE email='" + userEmail + "' AND daysLeft='" + alarm + "'" , function (error, rowCount, rows) {
            if (error) {
              console.log("GETTING HERE " + error);
            }
            else {
              console.log("request2");
              var foods = rows;
              var text = "";
              var html = "";
              for(var i = 0; i < foods.length; i++){
                text += foods[i][0] + " \r\n";
                html += "<li>" + foods[i][0] + "</li>";
              }
              let mailOptions = {
                from: '"Your Friends At Yams" <yamsreminder@gmail.com>', // sender address
                to: userEmail + ', Adamsmith6300@gmail.com', // list of receivers
                subject: 'Gotta Eat up!', // Subject line
                text: 'Your foods are expiring! ' + text, // plain text body
                html: '<h2>Your foods are expiring!</h2><ul>' + html + '</ul>' // html body
              };
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
              });
            }
          });
          connection.execSql(request);
          request.on("requestCompleted", function(){
            i++;
            console.log("Complete: " + i);
            sendMail(i);
          });
        }

      }
      var i = 0;
      sendMail(i);
      console.log( "I NOW " + i);

  });
}



connection.on('connect', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("connected");
    }
});

connection.getUserFoodData = function (req, res, next) {
    console.log('Reading rows from the Table...');

    // Read all rows from table
    getUserFoodDataRequest = new Request ("SELECT foodName, daysLeft FROM usersFoodData WHERE email=" + "'" + req.user.email + "'",
    		function (err, rowCount, rows)
            {
                if (err) {
                    console.log(err);
                } else {
                    var usersFood = rows;
                    res.render('fridge', { usersFood: usersFood, userName: req.user.name });
                    // connection.setupNodemailer();
                    // connection.checkForAlarms();
                }
            }
    );
    connection.execSql(getUserFoodDataRequest);
}



module.exports = connection;
