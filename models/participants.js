module.exports = function(app, mongoose) {
	
	var Schema = mongoose.Schema;  

	var participants = new Schema({
	    first_name: { type: String, required: true },
	    last_name: { type: String, required: false },
	    notes: { type: String, required: false },
		id: { type: String, required: true }, 
		experiments: [Schema.Types.Mixed]
	});
	return mongoose.model('Participant', participants);
}
