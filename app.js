var express  = require("express"),
	app = express(),
	bodyparser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	localStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	
	User = require("./models/user"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	seedDB = require("./seeds");

// Connect to DB 
seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");

// JSON Parser & view engine setup
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Set up stylesheet
app.use(express.static(__dirname + "/public"));

// Passport Config
app.use(require("express-session")({
	secret: "blablabla",
	resave: false,
	saveUnitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

// ======== ROUTE ========
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
			res.render("campgrounds/index", {
				campgrounds:  allcamps,
				currentUser: req.user
			});
		}
	});
});

// NEW
app.get("/campgrounds/new", isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});


// CREATE
app.post("/campgrounds", isLoggedIn, function(req,res){
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
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, foundCamp){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: foundCamp});
		}
	});
});

// CREATE
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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



// ================ AUTH ROUTE =================
// Show register form
app.get("/register", function(req, res){
	res.render("register");
});
// Hangle sign up
app.post("/register", function(req, res){
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
app.get("/login", function(req, res){
	res.render("login");
});
// Handle login
app.post("/login", 
		 passport.authenticate("local",{
						successRedirect: "/campgrounds",
						failureRedirect: "/login"
							}),
		 function(req, res){
});
// Log out
app.get("/logout", function(req, res){
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


// listener
app.listen(3000, function(){
	console.log("YelpCamp Server listening on port 3000.");
});
