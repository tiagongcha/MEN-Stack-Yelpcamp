var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var session = require("express-session");

// import self-defined modules:
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");
var User = require("./models/user.js");
var seedDB = require("./seeds.js");
seedDB();

//create yelpcamp database inside mongodb:
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
//check if connection is successful or not:
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected");
});

//passport configuration:
app.use(session({ secret: "cats", resave:false, saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({extended:true}));

// set up view engine:
app.set("view engine", "ejs");


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
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	})
});

//RENDER the form page:
app.get("/campground/newCamp", function(req,res){
	res.render("campgrounds/newCamp");
});

//POST client's input to campground page:
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

//SHOW one object in db:
app.get("/campground/:id", function(req,res){
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, thiscamp){
		if (err) {
			console.log(err);
		}else{
			//render show template with that campground
			res.render("campgrounds/show", {campground: thiscamp});
		}
	});
});

//===================
// Comments Routes
//===================
app.get("/campground/:id/comments/new", isLoggedIn,function(req, res){
	// find campground by id:
	// about middleware, if isLoggesin-> next() refers to the callback function next:
	Campground.findById(req.params.id,function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: campground});
		}
	})
	
});

app.post("/campground/:id/comments", function(req, res){
	// find campground by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log("err in finding comment page id");
			res.redirect("/campground");
		}else{
			 console.log(req.body.comment);
			 Comment.create(req.body.comment, function(err, comment){
			 	if(err){
			 		console.log("err in adding comment");
			 	}else{
			 		campground.comments.push(comment);
			 		campground.save();
			 		res.redirect('/campground/' + campground._id);
			 	}
			 })
		}
	})
})

//===================
// Auth Routes
//===================
app.get("/register", function(req, res){
	res.render("register")
});

app.post("/register", function(req, res){
	var newUser = new User({username:req.body.username});
	User.register(newUser,req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campground");
		})
	});
});

app.get("/login", function(req,res){
	res.render("login")
});

app.post("/login",passport.authenticate("local", {
	successRedirect:"/campground",
	failureRedirect:"/login"
}),function(req,res){});

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campground");
});

// define a middleware:
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login")
}

app.listen(3000, ()=>{
	console.log("yelpcamp server has started");

});