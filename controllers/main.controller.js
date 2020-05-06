const Post = require('../models/post.model');
const Follow = require('../models/follow.model');
const path = require('path');
const userController = require('./user.controller');
const postController = require('./post.controller');
const User = require('../models/user.model');

module.exports.index = async (req, res) =>{
    var userID = req.signedCookies.userID;
    var skip = 0;
    var posts = await postController.getPost(skip, userID);
    var data = await Promise.all(posts.map( async post => {
        var ownerInfo = await User.findOne({_id: post.owner});
        var rs = {
            id:      post._id,
            owner:   post.owner,
            caption: post.caption,
            date:    post.postDate,
            imgUrl:  post.imgUrl,
            ownerInfo: {
                avatar: ownerInfo.avatar,
                username: ownerInfo.username
            }
        }
        return rs;
    }));
    console.log(data);
    res.render('index', {myInfo: res.locals.userObj, posts: data});
};