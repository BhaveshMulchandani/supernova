const {param, body, validationResult} = require('express-validator');
const mongoose = require('mongoose');

function validateresult (req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    next();
}



const validateitemtocart = [
    body('productId').isString().withMessage('product ID must be a string').custom(value=>mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid product ID'),
    body('quantity').isInt({gt:0}).withMessage('Quantity must be a positive integer'),
    validateresult
]

const validateupdatecartitem = [
    param('productId').isString().withMessage('Product ID must be a string').custom(value=>mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid product ID'),
    body('quantity').isInt({gt:0}).withMessage('Quantity must be a positive integer'),
    validateresult
]

module.exports = {validateitemtocart, validateupdatecartitem}