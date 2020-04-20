const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/moment",{useNewUrlParser: true, useUnifiedTopology: true});

var Schema = mongoose.Schema({
    owner: mongoose.Types.ObjectId,
    content: String
});

var comment = mongoose.models("post", Schema);

module.exports = comment;
