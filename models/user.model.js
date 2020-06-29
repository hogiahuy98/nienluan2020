const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/moment",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    name:     String,
    email:    String,
    avatar:   String,
});

var user = mongoose.model("users", userSchema);

module.exports = user;