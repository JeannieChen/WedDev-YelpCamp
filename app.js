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


// Campground.create(
// {
// 	name: "Clear Creek", 
//  	image: "https://images.unsplash.com/photo-1578582805561-4abd22211b9e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
// 	description: "Love this place!!",
// 	}, function(err, campground){
// 	if(err){
//  			console.log(err);
//  		}else{
//  			console.log("NEW CAMPGROUND: ");
//  			console.log(campground);
//  		}
//  }
//  )


// Landing page: root
app.get("/", function(req, res){	
	res.render("landing");
});

// Camp route
app.get("/campgrounds", function(req, res){
	Campground.find({}, function(err, allcamps){
		if(err){
			console.log(err);
		} else{
			res.render("index", {campgrounds:  allcamps});
		}
	});
});

// Post: user submit campgrounds
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


app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs");
});

// Show description
app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
		if(err){
			console.log(err);
		}else{
			res.render("show", {campground: foundCamp});
		}
	});
});

// listener
app.listen(3000, function(){
	console.log("YelpCamp Server listening on port 3000.");
});
