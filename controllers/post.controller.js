const Post = require('../models/post.model');
const path = require('path');

module.exports.upload = async (req, res) => {
    if(!req.file) return res.send('chua chon file');

    var postOjb = {
        owner: req.signedCookies.userID,
        caption : req.body.caption,
        postDate: Date.now(),
        imgUrl: 'uploads/' + path.basename(req.file.path)         
    }
    var posting = await Post.create(postOjb);
    
    if(!posting) return res.send('loi khi post bai');
    return res.redirect('/');
}