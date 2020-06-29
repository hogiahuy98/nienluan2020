const express = require('express');
const router   = express.Router();
const controller = require('../controllers/post.controller');
const multer = require('multer');

var storage  = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/')
    },
    filename: (req, file, callback) =>{
        callback(null, Date.now().toString() + file.originalname);
    }
})
const upload = multer({storage: storage});

router.post('/post',upload.single('img'), controller.upload);
router.get('/post/:postID', controller.getOnePost);
router.get('/post/noti/:notiID/:postID', controller.getPostFromNoti);

router.post('/updatePost/:postID', controller.updatePost);
router.post('/deletePost/:postID', controller.deletePost);

module.exports = router;