var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js")
mongoose.Promise = global.Promise;

function seedDB(){
	//create some data:
	var camps = [
	{
		name: "Granite Hill",
		img: "https://images.unsplash.com/photo-1517824806704-9040b037703b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=60",
		description: "blue tent under milkyway"
	},
	{
		name: "Cloud's Rest",
		img: "https://images.unsplash.com/photo-1525811902-f2342640856e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=60",
		description: "woman sitting on chair near tent"

	},
	{
		name: "People's View",
		img:"https://images.unsplash.com/photo-1535700601052-b90a78c466f5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=60",
		description:"people gathering on a picnic"
	}
	];

	// Something to note when using Promises in combination with Mongoose async operations is that Mongoose queries are not Promises. 
	// Queries do return a thenable, but if you need a real Promise you should use the exec method.
	
	Campground.deleteMany({}).exec()
		.then(function(){return Comment.deleteMany({}).exec()})
			.then(camps.forEach(function(camp){
				var newCamp = new Campground(camp);
				// console.log(newCamp);
				return newCamp.save();
			}))
				.then(console.log("add new camp ground"))
					.catch((err) => {console.log("error: ", err)});

	//seeded!
	console.log("database seeded");
}
module.exports = seedDB;
