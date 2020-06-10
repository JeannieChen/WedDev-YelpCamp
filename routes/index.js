var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware/index.js");


// Landing page: root
router.get("/", function(req, res){	
	res.render("landing");
});

// ================ AUTH ROUTE =================
// Show register form
router.get("/register", function(req, res){
	res.render("register");
});
// Hangle sign up
router.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			req.flash("error", err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp, " + user.username + "!");
			res.redirect("/campgrounds");
		})
	})
});
// Show login form
router.get("/login", function(req, res){
	res.render("login");
});
// Handle login
router.post("/login", 
		 passport.authenticate("local",{
						successRedirect: "/campgrounds",
						failureRedirect: "/login"
							}),
		 function(req, res){
});
// Log out
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "You've logged out.");
	res.redirect("/campgrounds");
});


module.exports = router;

