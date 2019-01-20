var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var session = require("express-session");
var methodOverride = require("method-override");
var flash = require("connect-flash");

// import self-defined modules:
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");
var User = require("./models/user.js");

// import routes 
var commentRoutes = require("./routes/comments.js");
var campgroundRoutes = require("./routes/campgrounds.js");
var indexRoutes = require("./routes/index.js");


//create yelpcamp database inside mongodb:
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
//check if connection is successful or not:
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected");
});

app.use(flash());

//passport configuration:
app.use(session({ secret: "cats", resave:false, saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(__dirname + '/public'));
// set up view engine:
app.set("view engine", "ejs");

// add our own middleware:
app.use(function(req,res,next){
	res.locals.error = req.flash("error");
 	res.locals.success = req.flash("success");
	res.locals.currentUser = req.user;
	next();
});
app.use(bodyParser.urlencoded({extended:true}));
app.use("/", indexRoutes);
app.use("/campground/:id/comments",commentRoutes);
app.use("/campground",campgroundRoutes);

app.listen(3000, ()=>{
	console.log("yelpcamp server has started");

});