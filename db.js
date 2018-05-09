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
    }

var connection = new Connection(config);

connection.on('connect', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("connected");
    }
});

connection.login = function (req, res, next) {
    console.log('Reading rows from the Table...');

    // Read all rows from table
    request = new Request("SELECT name FROM users WHERE email=" + "'" + req.body.email + "'",
        function (err, rowCount, rows)
        {
            if (err)
            {
                console.log(err);
            }
            else
            {
                var userName = rows[0][0].value;
                console.log(userName);
                req.session.userName = userName;
                req.session.email = req.body.email;
            }
        }
    );
    connection.execSql(request);

    request.on('requestCompleted',
        function ()
        {
            connection.execSql(new Request("SELECT foodName, daysLeft FROM usersFoodData WHERE email=" + "'" + req.body.email + "'",
                function (err, rowCount, rows)
                {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        var usersFood = rows;
                        res.render('fridge', { usersFood: usersFood, userName: req.session.userName });
                    }
                }));
        });
}

module.exports = connection;
