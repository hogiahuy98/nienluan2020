const express = require('express');
const router   = express.Router();
const controller = require('../controllers/user.controller');

router.get('/login', controller.loginPage);
router.post('/login', controller.validateLogin);
router.get('/signout', controller.signOut);

module.exports = router;