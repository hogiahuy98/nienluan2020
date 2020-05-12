const Post = require("../models/post.model");
const Follow = require('../models/follow.model');


module.exports.isNextalbe = async (req, res, next) => {
    var userID = req.signedCookies.userID;
    var listFollow = await Follow.find({follower: userID},{followee: 1});
    if (!req.params.page){
        var page = 1;
    }
    else
        var page = req.params.page;
    var list = listFollow.map(element => {
        return element.followee;
    });
    list.push(userID);

    var count = await Post.find({
        owner : {$in : list}
    });
    count = count.length;
    if (count <= 5 * parseInt(page))
        res.locals.nextable = false;
    else
        res.locals.nextable = true;
    next();
    }