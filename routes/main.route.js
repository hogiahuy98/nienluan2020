const express = require('express');
const router   = express.Router();
const userController = require('../controllers/user.controller');
const postController = require('../controllers/post.controller');
const mainController = require('../controllers/main.controller');
const multer = require('multer');
const path = require('path');
const postMiddleware = require('../middlewares/post.middleware')


var storage  = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/avatars/')
    },
    filename: (req, file, callback) =>{
        callback(null, file.originalname);
    }
})
const upload = multer({storage: storage});

router.get('/search/:page', userController.search);


router.get('/', postMiddleware.isNextalbe,mainController.index);
router.get('/page/:page', postMiddleware.isNextalbe, mainController.indexPage);

router.post('/follow/:id',userController.follow);
router.post('/unfollow/:id',userController.unfollow);
router.post('/unfollowByUsername/:username',userController.unfollowByUsername);
router.post('/avatar',upload.single('img'), userController.changeAvatar);
router.post('/like/:postID', mainController.like);
router.post('/unlike/:postID', mainController.unlike);

router.post('/changepassword/', userController.changePassword);

module.exports = router;