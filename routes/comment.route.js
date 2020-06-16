const Comment = require("../models/comment.model");
const Post    = require('../models/post.model');
const controller = require("../controllers/comment.controller");
const express = require('express');
const router  = express.Router();

router.post('/comment/:postID', controller.comment);

module.exports = router;