const { body, validationResult } = require('express-validator');

const respondwithvalidationerrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

const registeruservalidation = [
    body('username').isString().withMessage('Username must be a string').isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters long'),
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isString().withMessage('Password must be a string').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('fullname.firstname').isString().withMessage('First name must be a string').notEmpty().withMessage('First name is required'),
    body('fullname.lastname').isString().withMessage('Last name must be a string').notEmpty().withMessage('Last name is required'),
    body('role').optional().isIn(['user', 'seller']).withMessage('Role must be either user or seller'),
    respondwithvalidationerrors
]

const loginuservalidation = [
    body('email').optional().isEmail().withMessage('Email must be a valid email address'),
    body('username').optional().isString().withMessage('Username must be a string'),
    body('password').isString().isLength({ min: 6 }).withMessage('Password must be a string and at least 6 characters long').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        if (!req.body.email && !req.body.username) {
            return res.status(400).json({ errors: [{ message: 'Either email or username is required' }]})
        }
        respondwithvalidationerrors(req, res, next);
    }
]

const useraddressvalidation = [
    body('street').isString().withMessage('Street must be a string').notEmpty().withMessage('Street is required'),
    body('city').isString().withMessage('City must be a string').notEmpty().withMessage('City is required'),
    body('state').isString().withMessage('State must be a string').notEmpty().withMessage('State is required'),
    body('zip').isString().withMessage('Zip must be a string').notEmpty().withMessage('Zip is required'),
    body('country').isString().withMessage('Country must be a string').notEmpty().withMessage('Country is required'),
    body('isDefault').isBoolean().withMessage('isDefault must be a boolean').optional(),
    respondwithvalidationerrors
]

module.exports = { registeruservalidation, loginuservalidation, useraddressvalidation };