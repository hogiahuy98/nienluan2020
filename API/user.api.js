const express = require('express');
const router  = express.Router();
const userDB  = require('../models/user.model');
const bcrypt  = require('bcrypt');
//Chua cac error


//Dang nhap, tra ve json chua 
router.post('/signin', async (req, res) => {
    var err = "Thông tin đăng nhập không chính xác";
    var userFind = await userDB.findOne( {username: req.body.username} )
                               .select ( {_id: 1, password:1} );
    //Neu khong tim duoc user, tra ve loi
    if (!userFind) 
        return res.json({err: err});
    //So sanh mat khau da nhap va mat khau trong dp
    var  comparePassword = await bcrypt.compare(req.body.password, userFind.password);
    if (!comparePassword) return res.json({err: err});
    //Dang nhap thanh cong, luu cookie
    res.cookie('userID', userFind._id, {signed:true});
    res.json({err: false});
})


module.exports = router;