const {body,validationResult} = require('express-validator')

const createproductvalidators = [
    body('title').isString().trim().notEmpty().withMessage('title is required'),
    body('primeamount').notEmpty().withMessage('priceamount is required').bail().isFloat({gt:0}).withMessage('priceamount must be a number'),
    body('pricecurrency').optional().isIn(['USD','INR']).withMessage('pricecurrency must be USD or INR')

]



const handlevalidationerrors = (req,res,next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({message:"Validation Error",errors:errors.array()})
    }
    next()
}


module.exports = {createproductvalidators,handlevalidationerrors}