module.exports = function(app, mongoose) {
	
	var Schema = mongoose.Schema;  

	var experiments = new Schema({
	   								environment: { type: Schema.Types.Mixed, required: true },
	    							name: { type: String, required: true },
	    							third_dimension: {type:Boolean, required:true, default: true},

									total_participants: { type: Number, required: true, default: 0 },
									trials: [{
												duration:  { type: Number, required: true },
												rest:  { type: Number, required: true },
												retention:  { type: Boolean, required: true, default: false},
												visible:  { type: Boolean, required: true, default: false},
												start_position: [Number],
											}],
									results: [{
												third_dimension:{type:String, required:true, default: "3D"},
												participant_name: { type: String, required: true },
												participant_id: { type: String, required: true },
												avg_time: { type: Number, required: true },
												avg_path: { type: Number, required: true },
												goal_q: { type: Number, required: true },

												trials: [{
															duration:  { type: Number, required: true },
															goal_found:  { type: Boolean, required: true },
															path_length:  { type: Number, required: true },
															goal_q:  { type: Number, required: true }
														}]
											}]
								});
	return mongoose.model('Experiment', experiments);
}