var mongoose = require("mongoose");
var Campground = require("./models/campground.js");

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

	// var promise = new Promise(function(resolve, reject){
		
	// })


	Campground.deleteMany({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("remove campgrounds");
	});

	camps.forEach(function(camp){
		var newCamp = new Campground(camp);
		newCamp.save();
		console.log("add new camp ground");
	});
	//seeded!
	console.log("database seeded");
}

module.exports = seedDB;
