const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/moment",{useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false});

var Schema = mongoose.Schema({
    _id: String,
    owner: mongoose.Types.ObjectId,
    content: String,
    date: Date
});

var comment = mongoose.model("comment", Schema);

module.exports = comment;
