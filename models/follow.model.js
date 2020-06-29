const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/moment",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});

var schema = mongoose.Schema({
    followee: mongoose.Types.ObjectId,
    follower: mongoose.Types.ObjectId
})

var follow = mongoose.model('follows', schema);

module.exports = follow;