const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/moment",{useNewUrlParser: true, useUnifiedTopology: true});

var Schema = mongoose.Schema({
    owner: mongoose.Types.ObjectId,
    caption: String,
    postDate: Date,
    likes: [mongoose.Types.ObjectId],
    comments: [mongoose.Types.ObjectId],
    imgUrl: String
});

var post = mongoose.model("post", Schema);

module.exports = post;
