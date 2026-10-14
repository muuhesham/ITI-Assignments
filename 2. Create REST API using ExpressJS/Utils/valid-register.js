const {body} = require("express-validator");

const validator = [
    body('name').notEmpty().withMessage("Name is Reuquired").isString().withMessage("Name must be string").trim().escape(),
    body('email').isEmail().withMessage("Invaild Email Foramt").normalizeEmail().escape(),
    body('password').isLength({min: 6}).withMessage("Password length must be 6").escape(),
];

module.exports = validator;