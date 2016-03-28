///////////////////////////////////////////////////////////////////////////////
// Requires modules dependencies.             						         //
///////////////////////////////////////////////////////////////////////////////
var fs = require('fs');
var cors = require('cors');
var https = require('https');
var multer = require('multer');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var rateLimit = require('express-rate-limit');
var expressSession = require('express-session');
var methodOverride = require('method-override');

var limiter = rateLimit({
	delayMs: 0,
	delayAfter: 0,
	max: 50,
	windowMs: 1000 * 60 * 60, // 1 hour
	message: 'Exceed limit rate, please wait maximum 60 minutes and try again'
});

///////////////////////////////////////////////////////////////////////////////
// Requires controllers dependencies.          						         //
///////////////////////////////////////////////////////////////////////////////

var config = require(__dirname + '/config.js').config;
var event = require(__dirname + '/controllers/event');
var user = require(__dirname + '/controllers/user');
var auth = require(__dirname + '/controllers/auth');

///////////////////////////////////////////////////////////////////////////////
// Initialization				            						         //
///////////////////////////////////////////////////////////////////////////////
var port = config('port');
var host = config('host');

var app = module.exports = express();

/*
var server = https.createServer({
	cert: fs.readFileSync(__dirname + '/ssl/cert.pem'),
	key: fs.readFileSync(__dirname + '/ssl/key.pem')
}, app);
*/

app.set('view engine', 'ejs');

app.use(cors());
app.use(multer());
app.use(methodOverride('_method'));
app.use(express.static(__dirname + './public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressSession({
	secret: 'joker',
	resave: false,
	saveUninitialized: false,
	cookie: {maxAge: 60000 * 60 * 24 * 30}
}));
app.use(auth.passport.initialize());
app.use(auth.passport.session());

var port = process.env.PORT || 3000;

///////////////////////////////////////////////////////////////////////////////
// Public API routes 				          						         //
///////////////////////////////////////////////////////////////////////////////
// Event
app.get('/public/event?', event.get);

// Authentification
app.get('/login/local', auth.passport.authenticate('local', {
	successReturnToOrRedirect: '/',
	failureRedirect: '/'
}));
app.get('/login', auth.passport.authenticate('basic', {
	successReturnToOrRedirect: '/',
	failureRedirect: '/'
}));
app.get('/auth/info', auth.ensureAuthenticated, auth.info);
app.get('/auth/twitter', auth.passport.authenticate('twitter'));
app.get('/auth/twitter/callback', auth.passport.authenticate('twitter', { failureRedirect: '/' }),
  	function (req, res) {
		if (req.user && !req.user.email) {
			res.redirect('/add/email');
		} else {
			res.redirect('/');
		}
	});
app.get('/auth/facebook', auth.passport.authenticate('facebook', { scope: 'email' }));
app.get('/auth/facebook/callback', auth.passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
	    res.redirect('/');
  	});
app.get('/logout', auth.logout);

// User
app.get('/public/user?', user.get);
app.get('/public/user/:userId', user.get);
app.post('/user', user.post);
app.put('/user', auth.ensureAuthenticated, user.put);
app.delete('/user', auth.ensureAuthenticated, user.delete);

app.listen(port, function() {
	console.log('Started http://localhost:' + port);
});