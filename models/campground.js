
var mongoose = require("mongoose");
 
var campgroundSchema = new mongoose.Schema({
   createdAt: {
	   type: Date,
	   default: Date.now
   },
   name: String,
   price: String,
   image: String,
   link: String,
   city: String,
   state: String,
   country: String,
   description: String,
   author: {
	   id: {
		   type: mongoose.Schema.Types.ObjectId,
		   ref: "User"
	   },
	   username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
	
   likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});
module.exports = mongoose.model("Campground", campgroundSchema);
