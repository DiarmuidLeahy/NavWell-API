/* Requires */
var fs = require('fs');
var mongoose = require('mongoose');

/* Local Variables */
var controllers = {};
var models = {};

/* Functions */
exports.loadModules = function(app) {


	console.log('');
	console.log('-------------------')
	console.log('Connecting to DB...' + app.configuration.getSetting(app.constants.CONFIG_CONNECTION_STRING));
	

	mongoose.Promise = global.Promise;						/*KCor - as suggested(http://stackoverflow.com/questions/38138445/node3341-deprecationwarning-mongoose-mpromise)
	//mongoose.connect('mongodb://10.7.0.3:27107/data/db');			 I placed 
																			  "mongoose.Promise = global.Promise;
																	 		   mongoose.connect('mongodb://10.7.0.3:27107/data/db');"

																	 into this file however i commented out the 'mongoose.connect('mongodb://10.7.0.3:27107/data/db');'
																	 and kept the original as it seemed to be just an example,
																	 the result being a solution to the api warning "(node:14572) DeprecationWarning: Mongoose:
																	 												 mpromise (mongoose's default promise library) 
																	 												 is deprecated, plug in your own promise library 
																	 												 instead: http://mongoosejs.com/docs/promises.html"
															*/
	mongoose.connect(app.configuration.getSetting(app.constants.CONFIG_CONNECTION_STRING));
	console.log('Done');

	console.log('Loading Models...');
	var modelFiles = fs.readdirSync(app.constants.INIT_MODELS_FOLDER);
	modelFiles.forEach(function(model) {
		if (model.indexOf(app.constants.INIT_MODEL_IDENTIFIER)>0) {
			model = model.replace('.js', '');
			models[model]=require(app.constants.INIT_MODELS_FOLDER+'/'+model)(app, mongoose);
		}
	});
	app.models = models;
	console.log('Done');
	if (app.configuration.getSetting(app.constants.CONFIG_ENABLE_CORS)) {
		console.log('CORS is enabled');
		app.all('*', function(req, res, next) {
			res.header('Access-Control-Allow-Credentials', true);
			res.header('Access-Control-Allow-Origin', req.headers.origin);
			res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
			res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization, Pragma, Cache-Control, If-Modified-Since');
			if ('OPTIONS' == req.method) {
				res.send(200);
			} else {
				next();
			}
		});
	}

	console.log('Loading Controllers...');
	var controllersFiles = fs.readdirSync(app.constants.INIT_CONTROLLERS_FOLDER);
	controllersFiles.forEach(function(controller) {
		if (controller.indexOf(app.constants.INIT_CONTROLLERS_IDENTIFIER)>0) {
			controller = controller.replace('.js', '');
			controllers[controller]=require(app.constants.INIT_CONTROLLERS_FOLDER+'/'+controller)(app);
		}
	});
	console.log('Done');
};
