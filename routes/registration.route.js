const express = require('express');
const router   = express.Router();
const controller = require('../controllers/user.controller');
const middlewares = require('../middlewares/authentication.middlewares');

router.get('/signup', middlewares.blockSomeSite, controller.registerPage);

router.post('/signup', controller.signup);

module.exports = router;