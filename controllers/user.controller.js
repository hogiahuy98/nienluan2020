const bcrypt = require('bcrypt');
const User   = require('../models/user.model');

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

module.exports.loginPage = (req, res) => {
    res.render('login', {err: false});
}

module.exports.validateLogin = async (req, res) => {
    var user = await User.findOne({username: req.body.username});
    if (user){
        var comp = await bcrypt.compare(req.body.password, user.password);
        if (comp){
            res.cookie('userID', user._id, {signed: true});
            return res.redirect('/');
        }
        else
            return res.render('login', {err: true});
    }
    else 
        return res.render('login', {err: true});
}