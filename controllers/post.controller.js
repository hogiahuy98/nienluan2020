const Post = require('../models/post.model');
const Follow = require('../models/follow.model');
const Comment = require('../models/comment.model');
const path = require('path');
const User = require('../models/user.model')

module.exports.upload = async (req, res) => {
    if(!req.file) return res.send('chua chon file');

    var postOjb = {
        owner: req.signedCookies.userID,
        caption : req.body.caption,
        postDate: Date.now(),
        imgUrl: '/uploads/' + path.basename(req.file.path)         
    }
    var posting = await Post.create(postOjb);
    
    if(!posting) return res.send('loi khi post bai');
    return res.redirect('/');
}

module.exports.getPosts = async (skip, userID) => {
        var listFollow = await Follow.find({follower: userID},{followee: 1});
        var list = listFollow.map(element => {
            return element.followee;
        });
        list.push(userID);
        var result = await Post.find({
            owner : {$in : list}
        }).sort({postDate: -1}).skip(skip*10).limit(10);
        return result;
}


module.exports.getOnePost = async (req, res) => {
    var postID = req.params.postID;
    var rs     = await Post.findOne({_id: postID});
    var ownerInfo = await User.findById(rs.owner,{username:1, _id:1, avatar: 1});
    if (rs.likes.indexOf(req.signedCookies.userID) != -1){
        var like = true;
    }
    else{
        var like = false;
    }
    var temp = await Comment.find({_id : {$in : rs.comments}});
    var comments = await Promise.all( temp.map(async comment => {
        var ownerInfo = await User.findOne({_id: comment.owner}, {_id:1, username: 1});
        comment.ownerInfo = ownerInfo;
        return comment;
    })
    )
    var data = {
        id:     rs._id,
        imgUrl: rs.imgUrl,
        caption:rs.caption,
        like: like,
        likeCount: rs.likes.length,
        comments: comments,
        ownerInfo: {
            id: ownerInfo._id,
            username: ownerInfo.username,
            avatar: ownerInfo.avatar
        }
    }

    res.render('post', 
    {
        myInfo: res.locals.userObj,
        post: data
    }); 
}