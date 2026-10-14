const isAdmin = (req, res, next) => {
  try {
    if (req.use && req.user.role == "admin") {
      return next();
    } else {
      const error = new Error("Access Denied: not Admin");
      error.statuscode = 403;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};

module.exports = isAdmin;
