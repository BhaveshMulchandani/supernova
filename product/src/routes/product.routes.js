const express = require('express');
const multer = require('multer');
const router = express.Router();
const Productcontroller = require('../controllers/product.controller');
const createauthmiddleware = require('../middlewares/auth.middlewares');
const {createproductvalidators} = require('../middlewares/validator.middleware');

const upload = multer({storage: multer.memoryStorage()});

router.post('/',createauthmiddleware(['admin','seller']), upload.array('image',5),createproductvalidators,Productcontroller.createproduct)
router.get('/', Productcontroller.getproducts)
router.patch('/:id',createauthmiddleware(["seller"]),Productcontroller.updateproduct)
router.delete('/:id',createauthmiddleware(["seller"]),Productcontroller.deleteproduct)
router.get('/seller',createauthmiddleware(['seller']),Productcontroller.getproductsbyseller)
router.get('/:id',Productcontroller.getproductsbyid)


module.exports = router;