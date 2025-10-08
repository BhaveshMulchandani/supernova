const express = require('express');
const multer = require('multer');
const router = express.Router();
const Productcontroller = require('../controllers/product.controller');
const createauthmiddleware = require('../middlewares/auth.middlewares');

const upload = multer({storage: multer.memoryStorage()});

router.post('/',createauthmiddleware(['admin','seller']), upload.array('image',5),Productcontroller.createproduct)
module.exports = router;