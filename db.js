var express = require('express');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "sql3.freemysqlhosting.net",
    user: "sql3235670",
    password: "jdxZ7a9s55",
    database: "sql3235670"
});

connection.connect();

module.exports = mysql;
module.exports = connection;