var express = require('express');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "sql3.freemysqlhosting.net",
    user: "sql3235670",
    password: "jdxZ7a9s55",
    database: "sql3235670"
});

connection.connect();

connection.login = function (req, res, next) {

    connection.query("SELECT ID,full_name FROM users WHERE email=" + JSON.stringify(req.body.email), function (error, result, field) {

        if (error) {
            console.log(error);
        }
        else {
            var json = JSON.parse(JSON.stringify(result));
            // console.log(json);
            var userID = json[0].ID;
            var userName = json[0].full_name;
            req.session.userID = userID;
            req.session.userName = userName;
            req.session.email = req.body.email;
            connection.query("SELECT foodName, daysLeft FROM usersFoodData WHERE ID=" + userID, function (error, result, fields) {
                var usersFood = JSON.parse(JSON.stringify(result));
                // console.log(json);
                res.render('user', { usersFood: usersFood, userName: userName });
            });
        }
    });
}

module.exports = connection;
