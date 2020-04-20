var User = require('../models/user.model');

module.exports.authCookie = async (req, res, next) => {
    if (!req.signedCookies.userID)
        return res.redirect('/login');
    
    var user = await User.findOne( {_id: req.signedCookies.userID} );
    if (!user)
        return res.redirect('/login');
    else
        res.locals.userObj = user;
    next();
}

module.exports.blockSomeSite = async (req, res, next) => {
    var user = await User.findOne( {_id: req.signedCookies.userID} );
    if(user)
        return res.redirect('/');
    next();
}