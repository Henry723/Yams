//Configuration for local authentication & Serialization & Deserialization

var express = require('express');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var dataProcessor = require('./DataProcessor');
var request = require('tedious').Request;
var googleStrategy = require('passport-google-oauth').OAuth2Strategy;

const GOOGLE_CLIENT_ID = '921816998744-7bo3fu2ouecuhcdolbdj971af7p5pkrv.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'TUjng4inPK-hmwaeoHQ1Dhz4';

const callback = (process.env.PORT) ?
		'https://calm-caverns-80656.herokuapp.com/Auth/google/callback' : 'http://localhost:3000/Auth/google/callback';

//used to serialize the user for the session
passport.serializeUser(function (user, done) { done(null, user); });

// used to deserialize the user
passport.deserializeUser
(
    function (email, done)
    {
        deserializeRequest = new request
        (
            "SELECT * FROM users WHERE email = " + "'" + email + "'"
            , function (err, rowCount, row)
              {
			      var result = [];
			      result.email = row[0][0].value;
			      result.name = row[0][1].value;
			      result.alarm = row[0][3].value;
			      done(err, result);
              }
        );
        dataProcessor.execSql(deserializeRequest);
    }
);

// configure local register strategy
passport.use
(
    'local-register'
    , new localStrategy
      (
          {
              usernameField: 'email', passwordField: 'password', passReqToCallback: true
          }
          , function (req, email, password, done)
            {
                checkRequest = new request
                (
                    "SELECT email FROM users WHERE email = '" + email + "'"
                    , function (err, rowCount, row)
                      {
                          if (err)
                          {
                              return done(err);
                          }

                          if (rowCount)
                          {
                              return done(null, false, { message: 'That email is already taken!' });
                          }
                          else
                          {
                              registerRequest = new request("insert into users (name, email, password) values ('" + req.body.name + "', '"
                                  + email + "', '" + password + "')", function () { return done(null, email); });
                              dataProcessor.execSql (registerRequest);
			              }
                      }
                );
                dataProcessor.execSql (checkRequest);
            }
      )
);

// configure local login strategy
passport.use
(
    'local-login'
    , new localStrategy
      (
          {
              usernameField: 'email', passwordField: 'password'
          }
          , function (email, password, done)
            {
                loginRequest = new request
                (
                    "SELECT * FROM users WHERE email = '" + email + "'"
                    , function (err, rowCount, row)
                      {
                          if (err)
                          {
	                          return done(err);
		                  }

                          if (!rowCount)
                          {
			                  return done(null, false, { message: 'There is no account with this email.' });
                          }
                          else if (!row[0][2].value)
                          {
		                      return done(null, false, { message: "Try 'login with Google'" });
                          }
                          else if (!(password == row[0][2].value))
                          {
				              return done(null, false, { message: 'Incorrect Password.' });
                          }
                          else
                          {
				              return done(null, row[0][0].value);
		                  }
                      }
                );
                dataProcessor.execSql(loginRequest);
	        }
      )
);

// configuration for google login.
passport.use
(
    new googleStrategy
    (
        {
            clientID: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET, callbackURL: callback
        }
        , function (accessToken, refreshToken, profile, done)
          {
	          var email = profile.emails[0].value;

              loginRequest = new request
              (
                  "SELECT * FROM users WHERE email = '" + email + "'"
                  , function (err, rowCount, row)
		            {
                        if (err)
                        {
                            return done(err);
                        }

			            if (!rowCount)
		                {
		                    registerRequest = new request("INSERT INTO users (name, email) VALUES ('"
                                + profile.displayName + "', '" + email + "')"
                            , function (err, rowCount, rows) { console.log("done"); return done(null, email); });

                            dataProcessor.execSql(registerRequest);
			            }
			            else
			            {
			                return done(null, email);
			            }
                    }
              );
              dataProcessor.execSql(loginRequest);
          }
    )
);

module.exports = passport;
