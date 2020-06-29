var User = require('../models/user.model');
var activity = require("../models/activity.model");

module.exports.authCookie = async (req, res, next) => {
    var thisUrl = req.originalUrl.slice(1, req.originalUrl.length);
    // req.io.engine.generateId = request =>{
    //     return req.signedCookies.userID;
    // }
    req.io.on("connection", socket =>{
        socket.join(req.signedCookies.userID);
    })
    if (thisUrl === 'signup') return next();
    if (!req.signedCookies.userID && thisUrl != "login"){ 
        return res.redirect('/login');
    }
    var user = await User.findOne( {_id: req.signedCookies.userID} , {_id:1, username: 1, avatar: 1});
    console.log(user);
    if (user == null && thisUrl != "login")
        return res.redirect('/login');
    else{
        var noti = await activity.find({notiTarget: req.signedCookies.userID, seen: false}).populate("user").populate("post");
        if(noti.length > 0)
            user.noti = noti;
        else if(thisUrl != "login")user.noti = [];
        console.log(noti);
        res.locals.userObj = user;
    }
    next();
}

module.exports.blockSomeSite = async (req, res, next) => {
    var user = await User.findOne( {_id: req.signedCookies.userID} );
    if(user)
        return res.redirect('/');
    next();
}