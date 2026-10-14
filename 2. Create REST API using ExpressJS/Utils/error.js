const {validationResult} = require('express-validator');

const errorhandler = (err, req, res, next)=>{
    const statuscode = err.statuscode || 500;
    const message = err.message || 'Server Error';

    res.status(statuscode).json({
        success: false,
        message: message,
        statuscode: statuscode,
    });
}

const validatorResult = (req, res, next)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const err = new Error().json({errors: errors.array()});
          err.statuscode = 400;
          return err;
        }
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = {errorhandler, validatorResult};