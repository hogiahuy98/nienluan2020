const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/moment",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});

var Schema = mongoose.Schema({
    time: Date,
    seen: Boolean,
    type: String,
    commentId: mongoose.Types.ObjectId,
    postId: mongoose.Types.ObjectId,
    owner: mongoose.Types.ObjectId
});

var activity = mongoose.models("post", Schema);

module.exports = activity;
