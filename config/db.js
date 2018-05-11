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

connection.setupNodemailer = function(){
  let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          type: 'OAuth2',
          user: 'yamsreminder@gmail.com',
          accessToken: 'ya29.Glu3BbW9eLdNt-D_rQoYSkzKBTEAyYs-WrEVX9oyhY8iQ9TGVDefMiWEL2ZCFLdZbQ4muEs3RD5F54Tyzlp5NB_1J-pPPajwJ39WZ64xlx3MlCxKT4qkMpbU335J'
      }
  });
}

connection.checkForAlarms = function(){
  request = new Request("SELECT * FROM users", function (error, rowCount, rows) {
      if (error) {
          console.log(error);
      }
      else {
        console.log("request1");
          var users = rows;
          for (var i in users){
            var alarm = users[i][3].value;
            var userEmail = users[i][0].value;
            var now = new Date();
            var warningDate = now.setDate(now.getDate() + alarm);
            request2 = new Request("SELECT * FROM usersFoodData WHERE email='" + userEmail + "' AND dayOut='" + warningDate + "'" , function (error, rowCount, rows) {
                if (error) {
                    console.log(error);
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
                        to: userEmail, // list of receivers
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
            connection.execSql(request2);
          }
      }
  });
  connection.execSql(request);
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
