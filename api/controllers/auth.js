var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;

var config = require('../config').config;

var User = require(__dirname + '/../models/user');

var TWITTER_CONSUMER_KEY = "TWITTER_CONSUMER_KEY"
var TWITTER_CONSUMER_SECRET = "TWITTER_CONSUMER_SECRET";
var TWITTER_TOKEN = "TWITTER_TOKEN";
var TWITTER_TOKEN_KEY = "TWITTER_TOKEN_KEY";

var FACEBOOK_APP_ID = "FACEBOOK_APP_ID";
var FACEBOOK_APP_SECRET = "FACEBOOK_APP_SECRET";

var FACEBOOK_APP_ID_TEST = "FACEBOOK_APP_ID_TEST";
var FACEBOOK_APP_SECRET_TEST = "FACEBOOK_APP_SECRET_TEST";

///////////////////////////////////////////////////////////////////////////////
// Local & Basic authenticate                                                //
///////////////////////////////////////////////////////////////////////////////
passport.use(new BasicStrategy(
  function(username, password, callback) {
      User.findOne({email: username}, function (err, user) {
          if (err) {
              return callback(err);
          } if (!user) {
              return callback(null, false);
          }

          user.verifyPassword(password, function(err, isMatch) {
              if (err) {
                  return callback(err);
              } if (!isMatch) {
                  return callback(null, false);
              }
              return callback(null, user);
          });
      });
  }
));

passport.use(new LocalStrategy(
  function(username, password, callback) {
      User.findOne({email: username}, function (err, user) {
          if (err) {
              return callback(err);
          } if (!user) {
              return callback(null, false);
          }

          user.verifyPassword(password, function(err, isMatch) {
            if (err) {
                return callback(err);
            } if (!isMatch) {
                return callback(null, false);
            }
            return callback(null, user);
          });
      });
  }
));

///////////////////////////////////////////////////////////////////////////////
// Facebook authenticate                                                     //
///////////////////////////////////////////////////////////////////////////////
/*
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID_TEST,
    clientSecret: FACEBOOK_APP_SECRET_TEST,
    callbackURL: config('facebookCallbackUrl'),
    profileFields: ['id', 'email', 'displayName', 'name', 'gender', 'is_verified', 'picture.type(large)'],
    enableProof: false
  },
  function(accessToken, refreshToken, profile, done) {
      done(null, null);
  }
));
*/

///////////////////////////////////////////////////////////////////////////////
// Serialize & Deserialize User                                              //
///////////////////////////////////////////////////////////////////////////////
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({_id: id}, function (err, user) {
      if (user) {
          done(null, user);
      } else {
          done(null, id);
      }
    });
});



///////////////////////////////////////////////////////////////////////////////
// Info, ensure & logout                                                     //
///////////////////////////////////////////////////////////////////////////////
exports.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send({"error": "Forbidden"});        
    }
}

exports.info = function(req, res) {
    var user = req.user;
    delete (user.password);
    res.send({
        'isAuthenticated': req.isAuthenticated(),
        user: user
    });        
}

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
}

exports.passport = passport;