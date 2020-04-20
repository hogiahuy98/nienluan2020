const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/moment",{useNewUrlParser: true, useUnifiedTopology: true});

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    name:     String,
    email:    String,
    avatar:   String,
    following:[],
    followed: []
});

var user = mongoose.model("User", userSchema);

module.exports = user;