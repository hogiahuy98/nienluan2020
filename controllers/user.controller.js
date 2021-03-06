const bcrypt = require('bcrypt');
const User   = require('../models/user.model');
const Follow = require('../models/follow.model');
const activity = require("../models/activity.model");
const path = require('path');

const default_avatar = '/img/default-avatar.png';

module.exports.registerPage = (req, res, next) => {
    res.render('signup', {err: false});
}
module.exports.signup = async (req, res) => {
        var password = await bcrypt.hash(req.body.password, 5); //Ma hoa password (bcrypt)
        var err = [];
        if(await User.findOne({username: req.body.username})){
            err.push('The username already exists');
        };
        if(await User.findOne({email: req.body.email})){
            err.push('The email already in use');
        };
        if(err.length > 0) return res.render('signup', {err: err});
        var user = {
            username: req.body.username,
            password: password,
            name:     req.body.name,
            email:    req.body.email,
            avatar:   default_avatar
        };
        User.create(user); //Luu vao db
        res.redirect('/login');
}

module.exports.signout = (req, res) => {
    if(!req.signedCookies.userID)
        return res.redirect('/');
    else{
        res.clearCookie("userID");
         return res.redirect('/login');
    }
}

module.exports.loginPage = (req, res) => {
    res.render('login', {err: false});
}

module.exports.validateLogin = async (req, res) => {
        var user = await User.findOne({username: req.body.username});
        if (user){
            var comp = await bcrypt.compare(req.body.password, user.password);
            if (comp){
                res.cookie('userID', user._id, {signed: true});
                return res.redirect('/');
            }
            else return res.render('login', {err: true});
        }
        return res.render('login', {err: true});
}

module.exports.search = async (req, res) => {
            var list = await User.find({
                    $and:[
                        {username: {'$regex': req.query.key}},
                        {_id:{$ne: req.signedCookies.userID}}
                    ]},
                    {_id:1,username:1, name:1, avatar:1})
                    .limit(10).skip(10* (req.params.page - 1)
            );
            if (list.length == 0) return res.send("Không tìm thấy người dùng nào");

            var localUser = req.signedCookies.userID, data = [];
            
            for (var i = 0; i < list.length; i++){
                var followed = await Follow.findOne({follower: localUser, followee: list[i]._id});
                if (followed != null)
                    followed = true;
                else
                    followed = false;
                data.push({
                    username: list[i].username,
                    followed : followed,
                    avatar : list[i].avatar,
                    _id : list[i]._id
                })
            }

            var nextPage, previousPage;
            if (Number(req.params.page) == 1)
                previousPage = false;
            else previousPage = "/search/" + (Number(req.params.page) - 1) + "/?key=" + req.query.key;

            if (data.length < 10)
                nextPage = false;
            else nextPage = "/search/" + (Number(req.params.page) + 1) + "/?key=" + req.query.key;

            var paging = {
                nextPage: nextPage,
                previousPage: previousPage
            }
            res.render('search', {
                list: data, 
                myInfo: res.locals.userObj,
                paging: paging
            });
}

module.exports.follow = async (req, res) => {
    var userID = req.signedCookies.userID;
    var followee = req.params.id; 
    var data = {
        follower: userID,
        followee: followee
    }
    var noti = new activity({
        seen: false,
        type: 2,
        user: userID,
        notiTarget: followee
    });
    await noti.save();
    noti = await (await activity.findById(noti._id)).populate("user");
    req.io.to(noti.notiTarget).emit("follow", {noti: noti});
    var find = await Follow.findOne({follower: userID, followee: followee});
    if (find) return res.send("Thất bại");
    await Follow.create(data);
    res.send("Thành công");
}

module.exports.unfollow = async (req, res) =>{
    var userID = req.signedCookies.userID;
    var followee = req.params.id; 
    await Follow.findOne({follower: userID, followee: followee}).remove();
    res.send("Thành công");
}

module.exports.unfollowByUsername = async (req, res) =>{
    var userID = req.signedCookies.userID;
    var find = await User.findOne({username: req.params.username}, {_id:1});
    //neu tim thay thi xoa document tuong ung
    if(find != null)
        await Follow.findOne({follower: userID, followee: find._id}).remove();
    res.send({success: true});
}

module.exports.changeAvatar = async (req, res) => {
    var avatar = '/uploads/avatars/' + path.basename(req.file.path);
    var update = await User.findOneAndUpdate({_id: req.signedCookies.userID}, {$set: {avatar}});
    console.log(update);
}

module.exports.getUserFD = async (userID) => {
    var result = await User.findOne({ _id: userID });
    return result;
}

module.exports.changePassword = async (req, res) => {
    var realOldPass = await User.findOne({_id : req.signedCookies.userID}, {password:1});
    var compare     = await bcrypt.compare(req.body.oldpass, realOldPass.password);
    if (!compare)
        var err = "Mật khẩu cũ chưa đúng";
    if (!err){
        realOldPass.password = await bcrypt.hash(req.body.newpass, 5);
        await realOldPass.save();
        res.send({
            success: true,
            err: false
        })
    }
    else{
        res.send({
            success: false,
            err: err
        })
    }
}