var Q = require('q');

var utils = require('../utils/common-functions.js');
var Response = require('../utils/response-creator/response-object');

module.exports = function(app){
	var environmentsModel = app.models['environments'];

	return {
		getEnvironments: function (req, res){
			//console.log(req.ips);
			var getEnvironments = Q.nbind(environmentsModel.find, environmentsModel);
			return getEnvironments({}, null, {
				sort: {'name':1}
			})
			.then(function(environments) {
				return new Response(environments);
			})
			.catch(function(pError) {
				console.log(pError);
				return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
			});
		}, 

		getEnvironmentById: function(req, res){
			var getEnvironment = Q.nbind(environmentsModel.findOne, environmentsModel);
			return getEnvironment({'_id': req.params.id}, null, {})
			.then(function(environment) {
				return new Response(environment);
			})
			.catch(function(pError) {
				console.log(pError);
				return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
			});
		},

		saveEnvironment: function (req, res){
			var environment = new environmentsModel({
				name: req.body.name,
				arena_type: req.body.arena_type,
				size: req.body.size,
				platform: req.body.platform,
				cues: req.body.cues
			});

			return Q.when(environment.save())
			.then(function() {
				return new Response(environment, app.constants.CODE_OK);
			}, function(pError) {
				console.log(pError);
				if (pError.http_code) {
					return new Response(pError.message, pError.http_code);
				} else {
					return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
				}
			});
		}, 

		deleteEnvironment: function(req, res){
			var removeEnv = Q.nbind(environmentsModel.remove, environmentsModel);
			var env = {
				_id : req.params.id
			};
			return Q.allSettled([removeEnv(env)]);
		}
	}
};