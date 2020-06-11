var Campground = require("../models/campground");
var Comment = require("../models/comment");


var funcObj = {};

funcObj.escapeRegex = function(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


module.exports = funcObj;