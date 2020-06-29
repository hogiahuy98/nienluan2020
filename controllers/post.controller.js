const Post = require('../models/post.model');
const Follow = require('../models/follow.model');
const Comment = require('../models/comment.model');
const activity = require("../models/activity.model");
const path = require('path');
const User = require('../models/user.model');
const fs = require('fs');
const { promisify } = require('util');
const deleteFile = promisify(fs.unlink);

module.exports.upload = async (req, res) => {
    if(!req.file) return res.send('chua chon file');

    var postOjb = {
        owner   : req.signedCookies.userID,
        caption : req.body.caption,
        postDate: Date.now(),
        imgUrl  : '/uploads/' + path.basename(req.file.path)         
    }
    var posting = await Post.create(postOjb);
    
    if(!posting) return res.send('loi khi post bai');
    return res.redirect('/');
}

const getMenu = (owner, user) =>{
    if ( owner == user){
        return {
            update  : true,
            delete  : true,
            unfollow: false
        }
    }
    else
        return  {
            update  : false,
            delete  : false,
            unfollow: true
        }
}

module.exports.getMenu = getMenu;

module.exports.getPosts = async (skip, userID) => {
        var listFollow = await Follow.find({follower: userID},{followee: 1});
        var list = listFollow.map(element => {
            return element.followee;
        });
        list.push(userID);

        var result = await Post.find({
            owner : {$in : list}
        }).sort({postDate: -1}).skip(skip * 5).limit(5);
        return result;
}

module.exports.getPostsFromUser = async (skip, userID) => {
    var result = await Post.find({owner: userID}).sort({postDate: -1}).skip(skip * 5).limit(5)
    return result;
}


module.exports.getOnePost = async (req, res) => {
    var postID    = req.params.postID;
    var rs        = await Post.findOne({_id: postID});
    var ownerInfo = await User.findById(rs.owner,{username:1, _id:1, avatar: 1});
    if (rs.likes.indexOf(req.signedCookies.userID) != -1){
        var like = true;
    }
    else{
        var like = false;
    }
    var temp     = await Comment.find({_id : {$in : rs.comments}});
    var comments = await Promise.all( temp.map(async comment => {
        var ownerInfo     = await User.findOne({_id: comment.owner}, {_id:1, username: 1});
        comment.ownerInfo = ownerInfo;
        return comment;
    })
    )
    var data = {
        id       : rs._id,
        imgUrl   : rs.imgUrl,
        caption  : rs.caption,
        like     : like,
        likeCount: rs.likes.length,
        comments : comments,
        menu: getMenu(ownerInfo._id, req.signedCookies.userID),
        ownerInfo: {
            id      : ownerInfo._id,
            username: ownerInfo.username,
            avatar  : ownerInfo.avatar
        }
    }

    res.render('post', 
    {
        myInfo  : res.locals.userObj,
        post    : data
    }); 
}

module.exports.updatePost = async (req, res) => {
    var postID = req.params.postID;
    var post   = await Post.findOne({_id: postID}, {caption: 1});
    if (!post || post.owner != req.signedCookies.userID) return res.send({
        success: false
    });
    post.caption = req.body.caption;
    await post.save();
    res.send({
        success: true,
        class  : res.locals.userObj.username,
        caption: post.caption
    })
}

module.exports.deletePost = async (req, res) => {
    var postID = req.params.postID;
    var rm     = await Post.findOne({_id: postID});
    if (rm.owner != req.signedCookies.userID)
        return res.send({
            success: false
        })
    await deleteFile(`${__dirname}/../public/${rm.imgUrl}`);
    await rm.remove();
    res.send({
        success: true
    });
}

module.exports.getPostFromNoti = async (req, res) => {
    var notiID = req.params.notiID,
        postID = req.params.postID;
    var temp = await activity.findOne({_id: notiID});
    temp.seen = true;
    await temp.save();
    return res.redirect('/post/'+postID);
}