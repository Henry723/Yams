/**
 *  include configuration for local authentication.
 */

var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./db');
var Request = require('tedious').Request;

//used to serialize the user for the session
passport.serializeUser(function(user, done) {
	console.log("serialize: " + user);
	done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function(email, done) {
	deserializeRequest = 
		new Request("select * from users where email = " + "'" + email + "'",
		function(err, rowCount, row) {
			var result = [];
			result.email = row[0][0].value;
			result.name = row[0][1].value;
			result.password = row[0][2].value;
			result.alarm = row[0][3].value;
			console.log('deserialize: ', result);
			done(err, result);
		});
	db.execSql(deserializeRequest);
});

// configure local strategy
passport.use(
	'local-login', 
	new LocalStrategy ({
	usernameField: 'email',
	passwordField: 'password'
	}, 
	function(email, password, done) {
		console.log("local strategy");
		console.log("email: ", email);
		console.log("password: ", password);
		loginRequest = new Request("select * from users where email = " + "'" + email + "'", function(err, rowCount, row) {
			console.log(row);
			if (err) {
				return done(err);
			}
			if (!row) {
				return done(null, false);
			}
			if (!(password == row[0][2].value)) {
				return done(null, false);
			}
			return done(null, row[0][0].value);
		});
		db.execSql(loginRequest);
	}
));
	
module.exports = passport;
