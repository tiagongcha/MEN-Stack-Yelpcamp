var Campground = require("../models/campground");
var Comment = require("../models/comment");
// js file for all middleware
// an object of various functions 
var middlewareObj = {};

middlewareObj.checkOwnership = function (req, res, next){
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

middlewareObj. checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated){	
		Comment.findById(req.params.comment_id, function(err, thiscomment){
			if(err){
				// req.flash("error", "Campground not found.");
				res.redirect("back");
			}else{
				if(thiscomment.length != 0){
					console.log("entered comment");
					if (thiscomment.author.id.equals(req.user._id)) {
						next();
					}			
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

middlewareObj.isLoggedIn = function (req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please login first");
	res.redirect("/login")
}

module.exports = middlewareObj;