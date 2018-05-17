/**
 *  include configuration for local authentication.
 */

var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./db');
var Request = require('tedious').Request;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const googleClientID = '921816998744-7bo3fu2ouecuhcdolbdj971af7p5pkrv.apps.googleusercontent.com';
const googleClientSecret = 'TUjng4inPK-hmwaeoHQ1Dhz4';
console.log("PORT" + process.env.PORT);
const callback = (process.env.PORT) ?
		'https://calm-caverns-80656.herokuapp.com/auth/google/callback' : 'http://localhost:3000/auth/google/callback';

//used to serialize the user for the session
passport.serializeUser(function(user, done) {
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
			result.alarm = row[0][3].value;
			done(err, result);
		});
	db.execSql(deserializeRequest);
});

// configure local register strategy
passport.use(
	'local-register',
	new LocalStrategy ({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function (req, email, password, done) {
		checkRequest = new Request("select email from users where email = '" + email + "'", function (err, rowCount, row) {
			if (err) { return done(err); }
			if (rowCount) { return done(null, false, {message: 'That email is already taken!' }); }
			else {
				registerRequest = new Request ("insert into users (name, email, password) values ('"
						+ req.body.name + "', '" + email + "', '" + password + "')",
						function () { return done(null, email); }
						);
				db.execSql (registerRequest);
			}
		});
		db.execSql (checkRequest);
	}
));

// configure local login strategy
passport.use(
	'local-login',
	new LocalStrategy ({
	usernameField: 'email',
	passwordField: 'password'
	},
	function(email, password, done) {
		loginRequest = new Request("select * from users where email = '" + email + "'", function(err, rowCount, row) {
			if (err) {
				return done(err);
			}
			if (!rowCount) {
				return done(null, false, { message: 'There is no account with this email.' });
			} else if (!row[0][2].value) {
				return done(null, false, { message: "Try 'login with Google'" });
			} else if (!(password == row[0][2].value)) {
				return done(null, false, { message: 'Incorrect Password.' });
			} else {
				return done(null, row[0][0].value);
			}
		});
		db.execSql(loginRequest);
	}
));

// configuration for google login.
passport.use(new GoogleStrategy({
	clientID: googleClientID,
    clientSecret: googleClientSecret,
    callbackURL: callback
	},
	function(accessToken, refreshToken, profile, done) {

			var email = profile.emails[0].value;
			loginRequest = new Request("select * from users where email = '" + email + "'", function(err, rowCount, row)
			{

				if (err) { return done(err); }

				if (!rowCount)
				{
					registerRequest = new Request("INSERT INTO users (name, email) VALUES ('"
							+ profile.displayName + "', '" + email + "')",
							function (err, rowCount, rows) {
								console.log("done");
								return done(null, email);
					});
					db.execSql(registerRequest);
				}
				else
				{
					return done(null, email);
				}
			});
			db.execSql(loginRequest);
	}));

module.exports = passport;
