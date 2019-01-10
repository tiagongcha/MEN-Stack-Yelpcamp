var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//INDEX - get the campground page listing all camp grounds
router.get("/", function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	})
});

//NEW the form page:
router.get("/newCamp",isLoggedIn, function(req,res){
	res.render("campgrounds/newCamp");
});

//CREATE client's input to campground page:
router.post("/", isLoggedIn, function(req, res){
	//get the new campground data from the form and append it to the campground list/DB:
	var name = req.body.name;
	var img = req.body.img;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name:name, img:img, description: description, author: author};
	//create a new Campground object and save it to database:
	Campground.create(newCampground, function(err, newCampObj){
		if(err){
			console.log("user input form item is wrong, cant be saved in database");
		}else{
			//if successfully saved in DB, redirect user to background
			console.log(newCampground + "createdddd");
			res.redirect("/campground");
		}
	});
});

//SHOW one object in db:
router.get("/:id", function(req,res){
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, thiscamp){
		if (err) {
			console.log(err);
		}else{
			console.log(thiscamp);
			//render show template with that campground
			res.render("campgrounds/show", {campground: thiscamp});
		}
	});
});

// EDIT campground route
router.get("/:id/edit", checkOwnership,function(req, res){	
	Campground.findById(req.params.id, function(err, thiscamp){		
		res.render("campgrounds/edit", {campground: thiscamp});
	});
});

// UPDATE campground route
router.put("/:id",checkOwnership, function(req,res){
	// find and update the correct campground:
	Campground.findByIdAndUpdate(req.params.id, req.body.edited, function(err,update){
		if(err){
			console.log("cantfindone");
			res.redirect("/campground");
		}else{
			console.log("findone");
			res.redirect("/campground/" + req.params.id);
		}
	})
});

// DESTROY campground route:
router.delete("/:id",checkOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err, removedCamp){
		if(err){
			console.log("prob deleting");
			res.redirect("/campground");
		}else{
			res.redirect("/campground");
		}
	})
});

// define middlewares:
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login")
}

function checkOwnership(req, res, next){
	if(req.isAuthenticated){	
		Campground.findById(req.params.id, function(err, thiscamp){
			if(err){
				// req.flash("error", "Campground not found.");
				res.redirect("back");
			}else{
				if(thiscamp.author.id.equals(req.user._id)){
					next();
				}else{
					// req.flash("error", "You do not have the permission to do that!");
					res.redirect("back");
				}				
			}
		});
	}else{
		req.flash("error", "Please Login First.");
		res.redirect("back");
	}
}


module.exports = router;