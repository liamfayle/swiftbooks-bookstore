const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/oauth-login', userController.oauth_login);
router.post('/oauth-register', userController.oauth_register);

module.exports = router;
