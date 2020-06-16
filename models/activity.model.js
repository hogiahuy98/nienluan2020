const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/moment",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});

var Schema = mongoose.Schema({
    seen: Boolean,
    type: String,
    id1: mongoose.Types.ObjectId,
    id2: mongoose.Types.ObjectId,
    idPost: mongoose.Types.ObjectId
});

var activity = mongoose.models("post", Schema);

module.exports = activity;
