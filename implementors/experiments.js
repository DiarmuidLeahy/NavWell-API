var Q = require('q');

var utils = require('../utils/common-functions.js');
var Response = require('../utils/response-creator/response-object');

module.exports = function(app)
{
	var experimentsModel = app.models['experiments'];
	var participantModel = app.models['participants'];


	var getTotalGoals = function(trials)
	{
		var res = 0;
		for (var i = trials.length - 1; i >= 0; i--) 
		{
			res+= trials[i].goal_found ? 1 : 0;
		}
		return res;
  	};

  	var getResultsStats = function(results, platform, scale, arena_type)
  	{
  		//Total times that the goal was found
  		var total_goal_found = 0,
  			duration = 0, //Total duration
  			path_length = 0; // Total path length
  		var avg_time, avg_path;
  		var trials = [];
  		

  		//Decide which is the goal quadrant
  		var goal_q = 1; 
  		if (platform[1] >= 0)
  			if (platform[0] >=0)
  				goal_q = 2;
  			else
  				goal_q = 1;
  		else {
  			if (platform[0] >=0)
  				goal_q = 4;
  			else
  				goal_q = 3;
  		}
  		var total_experiment_weight = 0,
  			total_q1 = 0, total_q2 = 0, total_q3 = 0, total_q4 = 0;

  		var scaled_paths = [];

  		//For each trial.
  		for(var i = 0; i < results.length; i++)
  		{

  			var res = results[i];
  			
  			
  			//Goal Found Counter'
  			if (res.goal_found) total_goal_found++;
			//Duration
  			duration += res.duration;
  			//Path
  			path_length += res.path_length;

  			//Path array: points will be scaled from [-1 to 1]
  			var scaled_path = [];

  			//Analyse quadrants
  			var q1 = 0, q2 = 0, q3 = 0, q4 = 0, total_weight = 0;
  			for (var j = 0; j < res.points.length; j++) 
  			{
  				//Point info. 
  				var x = res.points[j][0];
  				var y = res.points[j][1];
  				var weight = (res.points[j].length == 2) ? 1 : res.points[j][2];


  				total_weight+=weight;
  				total_experiment_weight+=weight;

  				
  				if(arena_type == 'triangle') {
  					//q1 or q2
  					if (y >= 0)//(1 - Math.sqrt(1.62)))		//This to give an accurate representation of the uneven quadrants of the triangle
	  				{
	  					if (x >= 0)
	  					{
	  						//+x and +y => quadrant 2
	  						q2+=weight;
	  						total_q2+=weight;
	  					}
	  					else 
	  					{

	  						//-x and +y => quadrant 1
	  						q1+=weight;
	  						total_q1+=weight;
	  					}
	  				}
	  				//q3 or q4
	  				else 
	  				{
	  					if (x >= 0)
	  					{
	  						//+x and -y => quadrant 4
	  						q4+=weight;
	  						total_q4+=weight;
	  					}
	  					else 
	  					{
	  						//-x and -y => quadrant 3
	  						q3+=weight;
	  						total_q3+=weight;
	  					}
	  				}

  				} else {
	  				if (y >= 0)
	  				{
	  					if (x >= 0)
	  					{
	  						//+x and +y => quadrant 2
	  						q2+=weight;
	  						total_q2+=weight;
	  					}
	  					else 
	  					{

	  						//-x and +y => quadrant 1
	  						q1+=weight;
	  						total_q1+=weight;
	  					}
	  				}
	  				//q3 or q4
	  				else 
	  				{
	  					if (x >= 0)
	  					{
	  						//+x and -y => quadrant 4
	  						q4+=weight;
	  						total_q4+=weight;
	  					}
	  					else 
	  					{
	  						//-x and -y => quadrant 3
	  						q3+=weight;
	  						total_q3+=weight;
	  					}
	  				}
	  			}

  				//Scale the point and add to the point
  				scaled_path.push([x/scale, y/scale, weight]);

  			}

  			scaled_paths.push(scaled_path);

  			trial_results = {
  				q1: (q1*100/total_weight),
  				q2: (q2*100/total_weight),
  				q3: (q3*100/total_weight),
  				q4: (q4*100/total_weight),
  				goal_q: 0,
  				path_length: res.path_length,
  				goal_found: res.goal_found,
  				duration: res.duration
  			};


  			if (goal_q == 1) trial_results.goal_q = trial_results.q1;
  			if (goal_q == 2) trial_results.goal_q = trial_results.q2;
  			if (goal_q == 3) trial_results.goal_q = trial_results.q3;
  			if (goal_q == 4) trial_results.goal_q = trial_results.q4;

  			trials.push(trial_results);
  		}

  		avg_time = duration / results.length;
  		avg_path = path_length / results.length;
  		


  		var total_q1_percentage = (total_q1*100/total_experiment_weight);
  		var total_q2_percentage = (total_q2*100/total_experiment_weight);
  		var total_q3_percentage = (total_q3*100/total_experiment_weight);
  		var total_q4_percentage = (total_q4*100/total_experiment_weight);

  		var goal_q_percentage = total_q1_percentage;
  		if (goal_q == 2) goal_q_percentage = total_q2_percentage;
  		if (goal_q == 3) goal_q_percentage = total_q3_percentage;
  		if (goal_q == 4) goal_q_percentage = total_q4_percentage;

  		return {
  			total_goal_found: total_goal_found,
  			avg_time: avg_time,
  			third_dimension: res.third_dimension,
  			avg_path: avg_path,
  			goal_q: goal_q_percentage,
  			trials: trials,
  			quadrants: [
  				total_q1_percentage,
  				total_q2_percentage,
  				total_q3_percentage,
  				total_q4_percentage
  			],
  			scaled_paths: scaled_paths
  		};
  	};

	return {

		getExperiments: function (req, res){
			var getExperiments = Q.nbind(experimentsModel.find, experimentsModel);
			return getExperiments({}, null, {
				sort: {'name':1}
			})
			.then(function(experiments) {
				return new Response(experiments);
			})
			.catch(function(pError) {
				console.log(pError);
				return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
			});
		},

		getExperimentById: function(req, res){
			var getExperiment = Q.nbind(experimentsModel.findOne, experimentsModel);
			return getExperiment({'_id': req.params.id}, null, {})
			.then(function(exp) {
				return new Response(exp);
			})
			.catch(function(pError) {
				console.log(pError);
				return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
			});
		},

		getExperimentResults: function(req, res){
			var getExperiment = Q.nbind(experimentsModel.findOne, experimentsModel);
			return getExperiment({'_id': req.params.id}, null, {})
			.then(function(exp) {
				if (exp){
					return new Response(exp.results);
				}
				return new Response([]);
			})
			.catch(function(pError) {
				console.log(pError);
				return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
			});
		},

		getExperimentResultsCSV: function(id){
			var getExperiment = Q.nbind(experimentsModel.findOne, experimentsModel);
			return getExperiment({'_id': id}, null, {})
			.then(function(exp) {
				if (exp){
					//Set up the header.
					var result = "PARTICIPANT ID,PARTICIPANT,GOAL FOUND,AVG. TIME (SECONDS),AVG. PATH,GOAL Q%\n"; 
					for (var i = 0; i < exp.results.length; i++){
						res = exp.results[i];
						result += res.participant_id + ","
								+ res.participant_name + ","
								+ getTotalGoals(res.trials) + ","
								+ res.avg_time + ","
								+ res.avg_path + ","
								+ res.goal_q + "\n";
					}
					return result;
				}
				return "";
			})
			.catch(function(pError) {
				return "";
			});
		},

		saveExperiment: function (req, res){
			var experiment = new experimentsModel({
				environment: req.body.environment,
				name: req.body.name,
				start_position: req.body.start_position,
				trials: req.body.trials,
				results: []
			});

			return Q.when(experiment.save())
			.then(function() {
				return new Response(experiment, app.constants.CODE_OK);
			}, function(pError) {
				console.log(pError);
				if (pError.http_code) {
					return new Response(pError.message, pError.http_code);
				} else {
					return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
				}
			});
		},

		deleteExperiment: function(req, res){
			var removeExp = Q.nbind(experimentsModel.remove, experimentsModel);
			var exp = {
				_id : req.params.id
			};
			return Q.allSettled([removeExp(exp)]);
		},

		saveExperimentResults: function(req, res){
			var participantId = req.body.participant_id;
			var experimentId = req.params.experiment;
			
			
			//Get the experiment
			var getExperiment = Q.nbind(experimentsModel.findOne, experimentsModel);
			return getExperiment({'_id': experimentId}, null, {})
			.then(function(experiment) {
				if (experiment){

					//Number of times the goal was found
					var results_stats = getResultsStats(req.body.results, experiment.environment.platform, req.body.coordinates_bound, experiment.environment.arena_type);
					
					//Get the participant of the experiment
					var getParticipant = Q.nbind(participantModel.findOne, participantModel);
					return getParticipant({'id': participantId}, null, {})
					.then(function(participant) {

						//Find the current experiment
						for (var i = 0; i < participant.experiments.length; i++){
							
							if(participant.experiments[i]._id == experimentId && !participant.experiments[i].attempted){

								participant.experiments[i].date_taken = new Date();
								participant.experiments[i].attempted = true;
								
								participant.experiments[i].third_dimension= req.body.third_dimension;
								
								participant.experiments[i].goal_found = results_stats.total_goal_found;
								participant.experiments[i].results.push({
									goal_q: results_stats.goal_q,
									avg_path: results_stats.avg_path,									
									avg_time: results_stats.avg_time, 
									quadrants: results_stats.quadrants,
									trials: results_stats.trials
								});

								for (var j = 0; j < participant.experiments[i].trials.length; j++) {
									participant.experiments[i].trials[j]['path'] = {
										"points": results_stats.scaled_paths[j]
									};
								}

								break;
							}
						}

						participant.markModified('experiments');

						return Q.when(participant.save())
						.then(function() {

							var trials_info = [];

							for(var i = 0; i < results_stats.trials.length; i++){
								trials_info.push({
									duration: results_stats.trials[i].duration, 
									goal_found: results_stats.trials[i].goal_found,
									path_length: results_stats.trials[i].path_length,
									goal_q: results_stats.trials[i].goal_q
								});
							}

							experiment.results.push({
								participant_name: participant.first_name + " " + participant.last_name,
								third_dimension: req.body.third_dimension ? "3D" : "2D",
								participant_id: participant.id,
								avg_path: results_stats.avg_path,
								avg_time: results_stats.avg_time,
								goal_q: results_stats.goal_q,
								trials: trials_info
							});

							experiment.markModified('results');

							return Q.when(experiment.save())
							.then(function() {
								return new Response({}, app.constants.CODE_OK);
							}, function(pError) {
								console.log(pError);
								if (pError.http_code) {
									return new Response(pError.message, pError.http_code);
								} else {
									return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
								}
							});

							
						}, function(pError) {
							console.log(pError);
							if (pError.http_code) {
								return new Response(pError.message, pError.http_code);
							} else {
								return new Response(app.constants.ERROR_DATABASE, app.constants.CODE_SERVER_ERROR);
							}
						});

						//Update the participant

						//return new Response(participant);
					})
					.catch(function(pError) {
						console.log(pError);
						return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
					});


				}
				return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
			})
			.catch(function(pError) {
				console.log(pError);
				return new Response(app.constants.ERROR_GETTING_DATA, app.constants.CODE_SERVER_ERROR);
			});

			//return new Response({}, app.constants.CODE_OK);
		}
	};
};