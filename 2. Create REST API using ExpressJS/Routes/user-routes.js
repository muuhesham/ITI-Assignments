const express = require("express");
const router = express.Router();
const userController = require('../Controllers/user-controller');
const validRegister = require("../Utils/valid-register");
const vaildLogin = require("../Utils/valid-login");
const { validatorResult } = require("../Utils/error");

router.post('/register', validRegister, validatorResult, userController.register);
router.post('/login', vaildLogin, validatorResult, userController.login);
router.post('/logout', userController.logout);
router.post('/refresh-token', userController.refreshToken);

module.exports = router;