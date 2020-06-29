const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/moment",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});

var Schema = mongoose.Schema({
    owner: mongoose.Types.ObjectId,
    caption: String,
    postDate: Date,
    likes: [mongoose.Types.ObjectId],
    comments: [String],
    imgUrl: String
});

var post = mongoose.model("posts", Schema);

module.exports = post;
