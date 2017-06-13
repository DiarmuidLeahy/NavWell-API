/**
 * Module dependencies.
 */
 
var application_root = __dirname;
var logger = require('./utils/logger');

var express = require('express');
var path = require('path');
var passport = require('passport');

var session = require('express-session');

var app = express();
var MongoStore = require('connect-mongo')(express);

app.configuration = require('./config');
app.constants = require('./utils/navwell-constants.js');


// Config
app.configure(function () {
	
	app.use(express.json());
    app.use(express.urlencoded());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	/**app.use(express.session({
		store: new MongoStore({
			url: app.configuration.getSetting(app.constants.CONFIG_CONNECTION_STRING)
		}),
		secret: '1234567890QWERTY'
	})); **/
	app.use(passport.initialize());
    //app.use(passport.session());

	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

/* Standard requires */
app.loader = require('./initializer');
app.dirname = application_root;
app.bcrypt = require('bcrypt');

/* Initial methods */
app.loader.loadModules(app);
require('./passport')(app, passport);

var rc = require('./utils/response-creator/response-creator')(app);
var experiments = require('./implementors/experiments.js')(app);

app.get('/api/v1/experiments/:id/results/csv', function (req, res) {
	experiments.getExperimentResultsCSV(req.params.id).then(function(data){
		res.setHeader('Content-disposition', 'attachment; filename=experiment-results.csv');
		res.set('Content-Type', 'text/csv');
		res.status(200).send(data);
	}, function(err) {
		res.status(404);
	});
});

// Launch server
var server = app.listen(app.configuration.getSetting(app.constants.CONFIG_PORTS));
console.log('Server listening on port '+app.configuration.getSetting(app.constants.CONFIG_PORTS));
