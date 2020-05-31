var express  = require("express");
var app = express();
var bodyparser = require("body-parser");

var campgrounds = [
	{name: "Salmon Creek", image: "https://images.unsplash.com/photo-1547041270-d3d54e1263cb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"},
	{name: "Clear Creek", image: "https://images.unsplash.com/photo-1578582805561-4abd22211b9e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"},
	{name: "Alum Creek", image: "https://images.unsplash.com/photo-1582570870711-a3f4a57d1dce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"},
	{name: "Clear Creek", image: "https://images.unsplash.com/photo-1578582805561-4abd22211b9e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"},
	{name: "Alum Creek", image: "https://images.unsplash.com/photo-1582570870711-a3f4a57d1dce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"}
]

app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");



// Landing page: root
app.get("/", function(req, res){	
	res.render("landing");
});

// Camp route
app.get("/campgrounds", function(req, res){
	res.render("campgrounds", {campgrounds:  campgrounds});
});

// Post: user submit campgrounds
app.post("/campgrounds", function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image};
	campgrounds.push(newCampground);
	// re-redict
	res.redirect("/campgrounds");
});


app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs");
});

// listener
app.listen(3000, function(){
	console.log("YelpCamp Server listening on port 3000.");
});
