var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user")


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
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
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
	res.redirect("/campgrounds");
});


// Define middleware function
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};


module.exports = router;

