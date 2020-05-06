const bcrypt = require('bcrypt');
const User   = require('../models/user.model');
const Follow = require('../models/follow.model');
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

module.exports.signOut = (req, res) => {
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
                var myInfo = user;
                res.cookie('userID', user._id, {signed: true});
                return res.redirect('/');
            }
            else
                return res.render('login', {err: true});
        }
        else 
            return res.render('login', {err: true});
}

module.exports.search = async (req, res) => {
            var list = await User.find({
                    $and:[
                        {username: {'$regex': req.query.key}},
                        {_id:{$ne: req.signedCookies.userID}}
                    ]},
                    {_id:1,username:1, name:1, avatar:1})
                    .limit(10).skip(10* (req.params.page - 1));
            if(list.length == 0) return res.send("Không tìm thấy người dùng nào");
            var localUser = req.signedCookies.userID;
            var data = [];
            for (var i = 0; i < list.length; i++){
                var followed = await Follow.findOne({follower: localUser, followee: list[i]._id});
                if(followed != null) followed = true;
                else         followed = false;
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

            if(data.length < 10){
                nextPage = false;
            }
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
    var find = await Follow.findOne({follower: userID, followee: followee})
    if (find) return res.send("Thất bại");
    var action = await Follow.create(data);
    res.send("Thành công");
}

module.exports.unfollow = async (req, res) =>{
    var userID = req.signedCookies.userID;
    var followee = req.params.id; 
    var find = await Follow.findOne({follower: userID, followee: followee}).remove();
    res.send("Thành công");
}

module.exports.changeAvatar = async (req, res) => {
    var avatar = '/uploads/avatars/' + path.basename(req.file.path)
    var update = await User.findOneAndUpdate({_id: req.signedCookies.userID}, {$set: {avatar}});
    console.log(update);
}

module.exports.getUserFD = async (userID) => {
    var result = await User.findOne({ _id: userID });
    return result;
}