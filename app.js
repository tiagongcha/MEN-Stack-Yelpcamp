var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");
//get landing page route:
app.get("/", function(req, res){
	res.render("landing");
});

var campgrounds = [
		{name:"hi", img: "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104491f5c471a0efb5bd_340.jpg"},
		{name:"hello", img:"https://pixabay.com/get/e03db50f2af41c22d2524518b7444795ea76e5d004b0144590f5c97ea5edb0_340.jpg"},
		{name:"hello", img:"https://pixabay.com/get/e03db50f2af41c22d2524518b7444795ea76e5d004b0144590f5c97ea5edb0_340.jpg"},
		{name:"hello", img:"https://pixabay.com/get/e03db50f2af41c22d2524518b7444795ea76e5d004b0144590f5c97ea5edb0_340.jpg"},
		{name:"hello", img:"https://pixabay.com/get/e03db50f2af41c22d2524518b7444795ea76e5d004b0144590f5c97ea5edb0_340.jpg"}
	];

//get the campground page listing all camp grounds
app.get("/campground", function(req, res){
	//list will be replaced by database:
	

	res.render("campgrounds", {campgrounds: campgrounds});
});

app.get("/campground/newCamp", function(req,res){
	res.render("newCamp");
});


app.post("/campground", function(req, res){
	//get the new campground data from the form and append it to the campground list/DB:
	var name = req.body.name;
	var img = req.body.imge;
	// console.log(name);
	// console.log();
	var newCampground = {name:name, img:img};
	campgrounds.push(newCampground);
	res.redirect("/campground");
});

app.listen(3000, ()=>{
	console.log("yelpcamp server has started");

});