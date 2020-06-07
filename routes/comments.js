
var express = require("express");
var router = express.Router();
var Campground = require("../models/campground"),
	Comment = require("../models/comment");


// NEW
router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, foundCamp){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: foundCamp});
		}
	});
});

// CREATE
router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);		
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else{
 					// Add usernamd & id to comment, save comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			})
		}
	})
});

// Define middleware function
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};


module.exports = router;