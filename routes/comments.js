var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
//===================
// Comments Routes
//===================

// NEW route to get the create form:
router.get("/new", isLoggedIn,function(req, res){
	// find campground by id:
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: campground});
		}
	})	
});

// CREATE route to post a new object to database:
router.post("/", isLoggedIn, function(req, res){
	// find campground by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log("err in finding comment page id");
			res.redirect("/campground");
		}else{
			 // console.log(req.body.comment);
			 Comment.create(req.body.comment, function(err, comment){
			 	if(err){
			 		console.log("err in adding comment");
			 	}else{
			 		// add username and id to comment class data
			 		comment.author.id = req.user._id;
			 		comment.author.username = req.user.username;
			 		comment.save();
			 		// save and push comment to campground class data
			 		campground.comments.push(comment);
			 		campground.save();
			 		res.redirect('/campground/' + campground._id);
			 	}
			 })
		}
	})
});

//EDIT comment:
router.get("/:comment_id/edit", function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});	
});


// define a middleware:
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login")
}

module.exports = router;