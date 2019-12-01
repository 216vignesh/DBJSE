//server.js

//set up
var path = require('path');
var PhoneNumber = require('awesome-phonenumber');
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var formidable = require('formidable');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'dbjse_mahvny' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(express.static('public'));
app.use(express.static('uploads'));

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
//author Route
var paperRouter = require('./app/paperRoutes.js');
app.use('/author/papers', paperRouter );

// launch ======================================================================
app.listen(port);
console.log('Connected on ' + port);
