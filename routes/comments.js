
var express = require("express");
var router = express.Router();
var Campground = require("../models/campground"),
	Comment = require("../models/comment");
var middleware = require("../middleware/index.js");


// NEW
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, foundCamp){
		if(err){
			req.flash("error", "Oops! Something went wrong.");
		}else{
			res.render("comments/new", {campground: foundCamp});
		}
	});
});

// CREATE
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			req.flash("error", "Oops! Something went wrong.");
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Oops! Something went wrong.");
					console.log(err);
				} else{
 					// Add usernamd & id to comment, save comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					
					campground.comments.push(comment);
					campground.save();
					
					req.flash("success", "Comment added!");
					res.redirect("/campgrounds/" + campground._id);
				}
			})
		}
	})
});

// EDIT
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			req.flash("error", "Oops! Something went wrong.");
			res.redirect("back");
		}else{
			res.render("comments/edit", {
			campground_id: req.params.id,
			comment: foundComment
			});				
		}
	})
});

// UPDATE
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			req.flash("error", "Oops! Something went wrong.");
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

// DESTROY
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			req.flash("error", "Oops! Something went wrong.");
			res.redirect("back");
		}else{
			req.flash("success", "Comment deleted.");
			res.redirect("/campgrounds/"+ req.params.id);
		}
	})
});
			
// // Define middleware function
// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// };

// function checkCommentOwnership(req, res, next){
// 	if(req.isAuthenticated()){
// 		Comment.findById(req.params.comment_id, function(err, foundComment){
// 			if(err){
// 				res.redirect("back");
// 			}else{
// 				// check user owns the comment
// 				if(foundComment.author.id.equals(req.user._id)){
// 					next();
// 				}else{
// 					res.redirect("back");
// 				}
// 			}	
// 		})	
// 	} else{
// 		res.redirect("back");
// 	}
// };

module.exports = router;