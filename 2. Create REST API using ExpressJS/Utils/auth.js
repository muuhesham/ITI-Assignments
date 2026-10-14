const jwt = require("jsonwebtoken");
const secretkey = process.env.JWT_SECRET;
const refreshkey = process.env.JWT_REFRESH_SECRET;

if (!secretkey) {
  throw new Error("JWT_SECRET must be set in the environment");
}

if (!refreshkey) {
  throw new Error("JWT_REFRESH_SECRET must be set in the environment");
}

const createtoken = (data) => {
  return jwt.sign(data, secretkey, { expiresIn: "15m" });
};

const refreshtoken = (data) =>{
    return jwt.sign(data, refreshkey, {expiresIn: "7d"})
}

const verifyrefreshtoken = (token) => jwt.verify(token, refreshkey);

const authMW = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", " ");
    if (token) {
      const payload = jwt.verify(token, secretkey);
      req.user = payload;
      next();
    } else {
      const error = new Error("Token not Found");
      error.statuscode = 401;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { createtoken, authMW, refreshtoken, verifyrefreshtoken };
