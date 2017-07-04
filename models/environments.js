module.exports = function(app, mongoose) {
	
	var Schema = mongoose.Schema;  

	var environments = new Schema({
	    name: { type: String, required: true },
	    arena_type: { type: String, required: true },
	    size: { type: String, required: true },
		platform: [Number],
		total_exp: {type: Number, required: false, default: 0},
		cues: [{
			point: [Number],
			size:  { type: String, required: true },
			type:  { type: String, required: true },
			colour: {type: String, required: false},
			intensity:  { type: Number, required: false, min: 0, max: 100 },
		}],
	});
	return mongoose.model('Environment', environments);
}
