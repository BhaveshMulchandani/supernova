const express = require('express');
const validator = require('../middlewares/validator.middleware');
const authController = require('../controllers/auth.controller');
const authmiddleware = require('../middlewares/auth.middleware');
const router = express.Router();


router.post('/register', validator.registeruservalidation, authController.registeruser)
router.post('/login', validator.loginuservalidation, authController.loginuser)
router.get('/me',authmiddleware,authController.getcurrentuser)
router.get('/logout',authController.logoutuser)
router.get('/users/me/addresses',authmiddleware,authController.getuseraddress)
router.post('/users/me/addresses',validator.useraddressvalidation,authmiddleware,authController.adduseraddress)
router.delete('/users/me/addresses/:addressid',authmiddleware,authController.deleteuseraddress)



module.exports = router