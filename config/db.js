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
    getUserFoodDataRequest = new Request("SELECT foodName, daysLeft FROM usersFoodData WHERE email=" + "'" + req.user.email + "'",
        function (err, rowCount, rows) {
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

connection.updateDaysLeft = function () {

    updateRequest = new Request("UPDATE usersFoodData SET daysLeft=daysLeft - 1",
        function (error) {
            if (error) {
                console.log(error);
            }
        });

    connection.execSql(updateRequest);
}

connection.calculateDaysLeft = function (designatedDate) {

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
