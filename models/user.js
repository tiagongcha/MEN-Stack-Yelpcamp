var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
// set up userschema:
var UserSchema = new mongoose.Schema({
	username:String,
	password:String
});
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);