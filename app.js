var express  = require("express"),
	app = express(),
	bodyparser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	flash = require("connect-flash"),
	localStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	methodOverride = require("method-override"),
	
	User = require("./models/user"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	seedDB = require("./seeds");

var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexoRoutes = require("./routes/index");

// Connect to DB 
// seedDB(); // Seed the database
mongoose.connect("mongodb://localhost/yelp_camp");

// JSON Parser & view engine setup, override, use flash
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

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
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// Set up routes
app.use(indexoRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);


// listener
app.listen(3000, function(){
	console.log("YelpCamp Server listening on port 3000.");
});
