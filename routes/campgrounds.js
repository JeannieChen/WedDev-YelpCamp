var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");


// INDEX
router.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, allcamps){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds/index", {
				campgrounds:  allcamps,
				currentUser: req.user
			});
		}
	});
});

// NEW
router.get("/campgrounds/new", isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});


// CREATE
router.post("/campgrounds", isLoggedIn, function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;

	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, image: image, description: desc, author: author};
	
	// Create a new campground and save to DB 	
	Campground.create(newCampground, function(err, newCamp){
			if(err){
				console.log(err);
			}else{
				// Redirect to campgrounds 			
				res.redirect("/campgrounds");
			}
		}
	)
});


// SHOW
router.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show", {campground: foundCamp});
		}
	});
});

// Define middleware function
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

module.exports = router;