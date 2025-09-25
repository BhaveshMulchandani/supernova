const express = require('express');
const validator = require('../middlewares/validator.middleware');
const authController = require('../controllers/auth.controller');
const authmiddleware = require('../middlewares/auth.middleware');
const router = express.Router();


router.post('/register', validator.registeruservalidation, authController.registeruser)
router.post('/login', validator.loginuservalidation, authController.loginuser)
router.get('/me',authmiddleware,authController.getcurrentuser)
router.get('/logout',authController.logoutuser)



module.exports = router