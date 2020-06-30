const Post = require('../models/post.model');
const Follow = require('../models/follow.model');
const Comment = require('../models/comment.model');
const path = require('path');
const userController = require('./user.controller');
const postController = require('./post.controller');
const User = require('../models/user.model');
const moment = require('moment');
const activity = require("../models/activity.model");

const getContentOfPost = async (post, userID) => {
    if ( (post.likes.indexOf(userID) != -1) && (post.likes.length > 0) )
        var like = true;
    else
        var like = false;
    
    var ownerInfo = await User.findOne({_id: post.owner}), comments  = [];
    if(post.comments.length > 0){
        var n;
        if(post.comments.length == 1)
             n = 1;
        else n = 2;
        for (var i = post.comments.length - n; i < post.comments.length; i++){
            var comment       = await Comment.findOne({_id: post.comments[i]});
            var ownercmtInfo  = await User   .findOne({_id: comment.owner},{_id: 1, username: 1});
            comment.ownerInfo = ownercmtInfo;
            comments.push(comment);
        }
    }
    if (comments.length < 1)
        comments = false;
    var date = moment(post.postDate).locale('vi').fromNow(),
        menu = postController.getMenu(post.owner, userID),
        rs   = {
        id:         post._id,
        owner:      post.owner,
        caption:    post.caption,
        date:       date,
        imgUrl:     post.imgUrl,
        comments:   comments,
        like:       like,
        likeCount:  post.likes.length,
        menu:       menu,
        ownerInfo: {
            _id:        ownerInfo._id,
            avatar:     ownerInfo.avatar,
            username:   ownerInfo.username
        }
    }
    return rs;
}

module.exports.index = async (req, res) =>{
    var userID = req.signedCookies.userID,
        skip   = 0,
        posts  = await postController.getPosts(skip, userID),
        data   = await Promise.all(posts.map(async post => {
        return await getContentOfPost(post, userID);
    }));
    if (res.locals.nextable)
        var next = 2;
    else
        var next = false;

    res.render('index', {myInfo: res.locals.userObj, posts: data, next: next, previous: false});
};

module.exports.profile = async (req, res) =>{
    var userID = req.params.userID,
        skip   = 0,
        posts  = await postController.getPostsFromUser(skip, userID),
        data   = await Promise.all(posts.map(async post => {
        return await getContentOfPost(post, userID);
    }));
    var profile = await User.findOne({_id: userID});

    var isFollow = await Follow.findOne({follower: req.signedCookies.userID, followee: userID});
    if(isFollow)
        isFollow = true;
    else isFollow = false;
    profile.isFollow = isFollow;

    var following = await Follow.find({follower: userID});
    profile.followingCount = following.length;

    var followee = await Follow.find({followee: userID});
    profile.followeeCount = followee.length;

    profile.isMine = false;
    if(profile._id == req.signedCookies.userID)
        profile.isMine = true;

    if (res.locals.nextable)
        var next = 2;
    else
        var next = false;

    res.render('profile', {myInfo: res.locals.userObj, posts: data, next: next, previous: false, profile: profile});
};

module.exports.profileNoti = async (req, res) => {
    var noti = await activity.findById(req.params.notiID);
    noti.seen = true;
    await noti.save();
    return res.redirect("/user/" + req.params.userID);
}


module.exports.indexPage = async (req, res) =>{
    var userID = req.signedCookies.userID,
        skip   = parseInt(req.params.page) - 1,
        posts  = await postController.getPosts(skip, userID),
        data   = await Promise.all(
            posts.map( async post => {
                return await getContentOfPost(post, userID);
                })
        );
    if (req.params.page == 2)
        var previous = "/";
    else 
        var previous =`/page/${req.params.page - 1}`;
    
    if (res.locals.nextable)
        var next = parseInt(req.params.page) + 1;
    else
        var next = false;
    
    res.render('index', {myInfo: res.locals.userObj, posts: data, previous: previous, next: next});
};

module.exports.profilePage = async (req, res) =>{
    var userID = req.params.userID,
        skip   = parseInt(req.params.page) - 1,
        posts  = await postController.getPostsFromUser(skip, userID),
        data   = await Promise.all(posts.map(async post => {
        return await getContentOfPost(post, userID);
    }));
    var profile = await User.findOne({_id: userID});

    var isFollow = await Follow.findOne({follower: req.signedCookies.userID, followee: userID});
    if(isFollow)
        isFollow = true;
    else isFollow = false;
    profile.isFollow = isFollow;

    var following = await Follow.find({follower: userID});
    profile.followingCount = following.length;

    var followee = await Follow.find({followee: userID});
    profile.followeeCount = followee.length;



    if (req.params.page == 2)
        var previous = "/";
    else 
        var previous =`/page/${req.params.page - 1}`;

    if (res.locals.nextable)
        var next = parseInt(req.params.page) + 1;
    else
        var next = false;
    res.render('profile', {myInfo: res.locals.userObj, posts: data, next: next, previous: previous, profile: profile});
};

module.exports.like = async (req, res) => {
    var from = req.signedCookies.userID,
        to   = req.params.postID,
        post = await Post.findById(to),
        noti = new activity({
            seen: false,
            type: 0,
            user: from,
            notiTarget: post.owner,
            post: post._id 
        });
    if (from != post.owner){
        await noti.save();
        noti = await activity.findById(noti._id).populate("post").populate("user");
        
        req.io.to(post.owner).emit("like",
            {noti: noti}
        );
    }
    if (post.likes.indexOf(from) == -1){
        post.likes.push(from);
        await post.save();
    }
    else
        return res.send("Đã có lỗi");
    
    res.send({
        success: true,
        likeCount: post.likes.length
    });
}

module.exports.unlike = async (req, res) => {
    var from   = req.signedCookies.userID;
    var to     = req.params.postID;
    var post   = await Post.findById(to);
    if (post.likes.indexOf(from) != -1){
        post.likes.pull(from);
        await post.save();
    }
    else{
        return res.send("Đã có lỗi");
    }
    res.send({
        success: true,
        likeCount: post.likes.length
    });
}