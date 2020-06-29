const Comment = require("../models/comment.model");
const Post    = require('../models/post.model');
const activity= require("../models/activity.model");

module.exports.comment = async (req, res) => {
    var data = {
        _id:   Date.now().toString(),
        owner: req.signedCookies.userID,
        content: req.body.content,
        date: Date.now()
    },
    post = await Post.findById(req.params.postID ,{_id:1, owner:1}),
    noti = new activity({
        seen: false,
        type: 1,
        user: req.signedCookies.userID,
        notiTarget: post.owner,
        post: req.params.postID 
    });

    await noti.save();
    noti = await activity.findById(noti._id).populate("post").populate("user");
    req.io.to(noti.post.owner).emit('comment', noti);
    var comment = await Comment.create(data);    
    await Post.findOneAndUpdate({_id: req.params.postID}, { $push: {comments: data._id}});
    //var temp = await Post.findOne({_id: req.params.postID});
    var dataToSend = {
        user: res.locals.userObj,
        comment: {
            id: comment._id,
            content: comment.content,
            date: comment.date
        }
    }
    res.send(dataToSend);
}