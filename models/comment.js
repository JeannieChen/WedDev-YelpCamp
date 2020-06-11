
var mongoose = require("mongoose");
 
var commentSchema = new mongoose.Schema({
	createdAt: {
	   type: Date,
	   default: Date.now
   	},
    text: String,
    author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},

	rating: {
        type: Number,
        default: 0
    }
});
 
module.exports = mongoose.model("Comment", commentSchema);