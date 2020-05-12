const Comment = require("../models/comment.model");
const Post    = require('../models/post.model');
const express = require('express');
const router  = express.Router();

router.post('/comment/:postID', async (req, res) => {
    var data = {
        _id:   Date.now().toString(),
        owner: req.signedCookies.userID,
        content: req.body.content,
        date: Date.now()
    }
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
});

module.exports = router;