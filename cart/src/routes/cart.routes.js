const express = require('express');
const createauthmiddleware = require('../middlewares/auth.middlewares')
const cartcontroller = require('../controllers/cart.controller')
const router = express.Router();
const validation = require('../middlewares/validatore.middleware');
const { create } = require('../models/cart.model');


router.post('/items',validation.validateitemtocart,createauthmiddleware(['user']),cartcontroller.additemtocart)
router.patch('/items/:productId',validation.validateupdatecartitem,createauthmiddleware(['user']),cartcontroller.updateitemquantity)
router.get('/',createauthmiddleware(['user']),cartcontroller.getcart)



module.exports = router;