// External Dependencies
var express 			= require('express');
var exprSession 	= require('express-session');
var logger 				= require('morgan');
var http 					= require('http');
var bodyParser 		= require('body-parser');
var cookieParser 	= require('cookie-parser');
var	passport 			= require('passport');
var mongoose 			= require('mongoose');
var flash 				= require('connect-flash');
// Internal Dependencies
var passConf 			= require('./server/auth/passport-config');
var routes 				= require('./server/routes/index');
var users 				= require('./server/routes/users');
var api 					= require('./server/routes/api');

var	app = express();

// Handlebars view setup
app.set('views', __dirname + '/server/views');
app.set('view engine', 'hbs');

// Connect to MongoLab DB
mongoose.connect('mongodb://adminmaf:mafmaf@ds035995.mongolab.com:35995/movies');

// URL parsing, express session
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(exprSession({ secret: 'ssklKDJ78fjH', resave: true, saveUninitialized: true }));

// Make flash messages available automatically
app.use(flash());
app.use(function setFlash(req, res, next) {
	  res.locals.flash = {
	    notice: req.flash('notice'),
	  	error: req.flash('error')
	  };
	  next();
	}
);

// Configure Passport Authentication
passConf();
app.use(passport.initialize());
app.use(passport.session());

// ROUTING
app.use('/', routes);
app.use('/', users);
app.use('/api', api);
// app.use(express.static('./builds'));
app.use(express.static('./builds/development'));
// app.use(express.static(__dirname + '/builds/development'));

// CONFIGURE PORT FOR DEV AND PROD, START SERVER
app.set('port', process.env.PORT || 3000);
var server = http.createServer(app);
server.listen(app.get('port'), function() {
	console.log('MOVIE TRADE server listening on port ' + app.get('port') + ' ...');
});
