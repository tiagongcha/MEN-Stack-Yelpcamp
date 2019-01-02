// in Node.js, each file is treated as a seperate module:
var mongoose = require("mongoose");
//schema setup:
var campgroundSchema = new mongoose.Schema({
	name: String,
	img: String,
	description: String,
	comments:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Campground", campgroundSchema);