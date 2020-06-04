var express  = require("express"),
	app = express(),
	bodyparser = require("body-parser"),
	mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	seedDB = require("./seeds");

// Connect to DB 
seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");

// JSON Parser & view engine setup
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");



// Landing page: root
app.get("/", function(req, res){	
	res.render("landing");
});

// INDEX
app.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, allcamps){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds/index", {campgrounds:  allcamps});
		}
	});
});

// NEW
app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});


// CREATE
app.post("/campgrounds", function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc};
	
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
app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show", {campground: foundCamp});
		}
	});
});


//  ================ COMMENT ROUTE =================
// NEW
app.get("/campgrounds/:id/comments/new", function(req, res){
	Campground.findById(req.params.id, function(err, foundCamp){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: foundCamp});
		}
	});
});

// CREATE
app.post("/campgrounds/:id/comments", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);		
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else{
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			})
		}
	})
});

//  ================ END COMMENT ROUTE =================

// EDIT
// UDPATE
// DESTROY




// listener
app.listen(3000, function(){
	console.log("YelpCamp Server listening on port 3000.");
});
