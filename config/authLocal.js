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
		loginRequest = new Request("select * from users where email = " + "'" + email + "'", function(err, rowCount, row) {
			if (err) {
				return done(err);
			}
			if (!rowCount) {
				return done(null, false, { message: 'Incorrect Username.' });
			}
			if (!(password == row[0][2].value)) {
				return done(null, false, { message: 'Incorrect Password' });
			}
			return done(null, row[0][0].value);
		});
		db.execSql(loginRequest);
	}
));

// configuration for google login.

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const googleClientID = '921816998744-7bo3fu2ouecuhcdolbdj971af7p5pkrv.apps.googleusercontent.com';
const googleClientSecret = 'TUjng4inPK-hmwaeoHQ1Dhz4';

passport.use(new GoogleStrategy({
    clientID: googleClientID,
    clientSecret: googleClientSecret,
    callbackURL: "http://localhost:3000/login/callback"
  },
  function(accessToken, refreshToken, profile, done) {
	  return done(null, profile.emails[0].value);
  }
));

module.exports = passport;
