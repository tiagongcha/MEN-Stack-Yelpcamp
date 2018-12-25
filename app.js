var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//create yelpcamp database inside mongodb:
mongoose.connect("mongodb://localhost/yelp_camp");
//check if connection is successful or not:
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected");
});


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

//schema setup:
var campgroundSchema = new mongoose.Schema({
	name: String,
	img: String,
	description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);
Campground.create(
	{name:"Granite Hill", 
	img: "https://pixabay.com/get/e835b20e29f0003ed1584d05fb1d4e97e07ee3d21cac104491f5c779a4edbdbd_340.jpg",
	description: "a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur"	
	},
	function(err, campground){
		if(err){
			console.log("err");
		}else{
			console.log(campground);
		}
	});


//get landing page route:
app.get("/", function(req, res){
	res.render("landing");
});

//INDEX - get the campground page listing all camp grounds
app.get("/campground", function(req, res){
	//Get all campground from db and render that file:
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("index", {campgrounds: allCampgrounds});
		}
	})
});

//render the form page:
app.get("/campground/newCamp", function(req,res){
	res.render("newCamp");
});

//post client's input to campground page:
app.post("/campground", function(req, res){
	//get the new campground data from the form and append it to the campground list/DB:
	var name = req.body.name;
	var img = req.body.img;
	var description = req.body.description;
	var newCampground = {name:name, img:img, description: description};
	//create a new Campground object and save it to database:
	Campground.create(newCampground, function(err, newCampObj){
		if(err){
			console.log("user input form item is wrong, cant be saved in database");
		}else{
			//if successfully saved in DB, redirect user to background
			res.redirect("/campground");
		}
	});
});

//show one object in db:
app.get("/campground/:id", function(req,res){
	//find the campground with provided ID
	Campground.findById(req.params.id, function(err, thiscamp){
		if (err) {
			console.log(err);
		}else{
			//render show template with that campground
			res.render("show", {campground: thiscamp});
		}
	});
});

app.listen(3000, ()=>{
	console.log("yelpcamp server has started");

});