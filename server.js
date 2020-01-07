// Import the server configuration file
var config 			= require('./config'),
    /* Import the ExpressJS framework for Middleware/routing */
    express 		= require('express'),
    /* Import the File System module for enabling File I/O operations */
	fs      		= require("fs"),
    /* Import Mongoose for enabling communication with MongoDB and
       management of data handling tasks */
   passport = require('passport'),
	mongoose 		= require('mongoose'),
    /* Import Body Parser module for enabling data from POST requests
       to be extracted and parsed */
	bodyParser      = require("body-parser"),
    /* Handle for storing the ExpressJS object */
	app 			= express(),
    /* Use ExpressJS Router class to create modular route handlers */
	apiRouter     	= express.Router(),
    /* Import path module to provide utilities for working with file
       and directory paths */
	path 			= require('path'),
    /* Define Mongoose connection to project's MongoDB database */
	connection 		= mongoose.connect(config.database, { useMongoClient: true });
    /* Import Schema for managing MongoDB database communication
       with Mongoose */




/* Manage size limits for POST/PUT requests */
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));
/* Manage CORS Access for ALL requests/responses */
app.use(function(req, res, next)
{
   /* Allow access from any requesting client */
   res.setHeader('Access-Control-Allow-Origin', '*');

   /* Allow access for any of the following Http request types */
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');

   /* Set the Http request header */
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    next();
});

app.use(passport.initialize());
var passportMiddleware = require('./middleware/passport');
passport.use(passportMiddleware);


/*

   Everything else that follows(all of the routes and application logic)
   NEEDS to be placed BEFORE the code at the bottom of the file!

*/

var apiRouter = require('./routes');

/* Mount the specified Middleware function based on matching path
   ALL Http requests will be sent to /api followed by whatever the
   requested endpoint is
*/
app.use('/api', apiRouter);

/* Open a UNIX socket, listen for connections to the specified port */
app.listen(config.port);