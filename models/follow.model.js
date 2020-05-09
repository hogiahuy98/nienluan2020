const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/moment",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});

var schema = mongoose.Schema({
    followee: mongoose.Types.ObjectId,
    follower: mongoose.Types.ObjectId
})

var follow = mongoose.model('follow', schema);

module.exports = follow;