
var Q = require('q');

var utils = require('../utils/common-functions.js');
var Response = require('../utils/response-creator/response-object');

module.exports = function(app){
	var participantModel = app.models['participants'];

	return {
		getParticipants: function (req, res){
			var getParticipants = Q.nbind(participantModel.find, participantModel);
			var projection = {
				'first_name': true,
				'last_name': true,
				'id': true,
				'experiments.attempted': true
			}
			return getParticipants({}, projection, {
				sort: {'id':1}
			})
			.then(function(participants) {
				return new Response(participants);
			})
			.catch(function(pError) {
				console.log(pError);
				return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
			});
		},

		getParticipantById: function(req, res){
			var getParticipants = Q.nbind(participantModel.findOne, participantModel);
			return getParticipants({'id': req.params.id}, null, {})
			.then(function(participant) {
				return new Response(participant);
			})
			.catch(function(pError) {
				console.log(pError);
				return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
			});
		},

		saveParticipant: function (req, res){
			var particpant = new participantModel({
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				id: req.body.id,
				notes: req.body.notes, 
				experiments: req.body.experiments || []
			});

			return Q.when(particpant.save())
			.then(function() {
				return new Response(particpant, app.constants.CODE_OK);
			}, function(pError) {
				console.log(pError);
				if (pError.http_code) {
					return new Response(pError.message, pError.http_code);
				} else {
					return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
				}
			});
		},

		updateParticipant: function(req, res){

			var updatedParticipant = {
				'experiments': req.body.experiments
			};

			for(var i = 0; i < updatedParticipant.experiments.length; i++){
				if (!updatedParticipant.experiments[i].attempted){
					updatedParticipant.experiments[i].results = [];
				}
			}

			return Q.when(participantModel.update({ _id : req.body._id }, { $set: updatedParticipant }).exec())
			.then(function(particpant){
				return new Response('OK', app.constants.CODE_OK);
			}, function(pError){
				console.log(pError);
				if (pError.http_code) {
					return new Response(pError.message, pError.http_code);
				} else {
					return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
				}
			});
		}
	}
}
