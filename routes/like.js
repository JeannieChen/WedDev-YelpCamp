var express = require("express");
var router = express.Router();
var Campground = require("../models/campground"),
	Comment = require("../models/comment");
var middleware = require("../middleware/index.js");

// Campground Like Route
router.post("/campgrounds/:id/like", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            req.flash("error", "Oops! Something went wrong.");
            return res.redirect("back");
        }

        // check if req.user._id exists in foundCampground.likes
        var foundUserLike = foundCampground.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundCampground.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundCampground.likes.push(req.user);
        }

        foundCampground.save(function (err) {
            if (err) {
                req.flash("error", "Oops! Something went wrong.");
                return res.redirect("back");
            }
            return res.redirect("/campgrounds/" + foundCampground._id);
        });
    });
});

module.exports = router;