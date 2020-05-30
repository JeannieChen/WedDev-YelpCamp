var express  = require("express");
var app = express();



// Landing page: root
app.get("/", function(req, res){
	res.send("Landing page");
});



// listener
app.listen(3000, function(){
	console.log("YelpCamp Server listening on port 3000.");
});