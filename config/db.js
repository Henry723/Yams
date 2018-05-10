var express = require('express');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

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
                    console.log(usersFood);
                    res.render('fridge', { usersFood: usersFood, userName: req.user.name });
                }
            }
    );
    connection.execSql(getUserFoodDataRequest);
}

module.exports = connection;
