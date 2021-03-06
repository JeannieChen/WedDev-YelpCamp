var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");
var func = require("../middleware/function.js");

// INDEX
router.get("/campgrounds", function(req, res){
	// Search for camp
	if(req.query.search){
		const regex = new RegExp(func.escapeRegex(req.query.search), 'gi');
		Campground.find({name: regex}, function(err, allcamps){
			if(err){
				req.flash("error", "Oops! Something went wrong.");
				console.log(err);
			} else{
				res.render("campgrounds/index", {
					campgrounds:  allcamps,
					currentUser: req.user
				});
			}
		})
	// If nothing in Search, show all camps
	}else{
		Campground.find({}, function(err, allcamps){
			if(err){
				req.flash("error", "Oops! Something went wrong.");
				console.log(err);
			} else{
				res.render("campgrounds/index", {
					campgrounds:  allcamps,
					currentUser: req.user
				});
			}
		})
	}
});

// NEW
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});


// CREATE
router.post("/campgrounds", middleware.isLoggedIn , function(req,res){
	var name = req.body.name;
	var city = req.body.city;
	var state = req.body.state;
	var country = req.body.country;
	var price = req.body.price;
	var link = req.body.link;
	var image = req.body.image;
	var desc = req.body.description;

	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {
		name: name, 
		city: city,
		state: state,
		country: country,
		price: price, 
		link: link, 
		image: image, 
		description: desc, 
		author: author};
	
	// Create a new campground and save to DB 	
	Campground.create(newCampground, function(err, newCamp){
			if(err){
				req.flash("error", "Oops! Something went wrong.");
				console.log(err);
			}else{
				// Redirect to campgrounds 	
				req.flash("success", "Campground added.");
				res.redirect("/campgrounds");
			}
		}
	)
});


// SHOW
router.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
		if(err){
			req.flash("error", "Oops! Something went wrong.");
			console.log(err);
		}else{
			res.render("campgrounds/show", {campground: foundCamp});
		}
	});
});

// EDIT 
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCamp){
		res.render("campgrounds/edit", {campground: foundCamp});	
	})	
});

// UPDATE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
		if(err){
			req.flash("error", "Oops! Something went wrong.");
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id)
		}
	})
});


// DESTROY
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash("error", "Oops! Something went wrong.");
			res.redirect("/campgrounds");
		}else{
			req.flash("success", "Campground deleted.");
			res.redirect("/campgrounds");
		}
	})
});


module.exports = router;