const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/moment",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});

var schema = mongoose.Schema({
    seen: Boolean,
    type: Number,
    date: Date,
    user: {
        type: mongoose.Types.ObjectId,
        ref:  "users"
    },
    notiTarget:{
        type: mongoose.Types.ObjectId,
        ref:  "users"
    },
    post: {
        type: mongoose.Types.ObjectId,
        ref:  "posts"
    }
});

var activity = mongoose.model("activities", schema);

module.exports = activity;
