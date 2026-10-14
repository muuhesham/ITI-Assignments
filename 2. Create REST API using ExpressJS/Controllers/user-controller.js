const User = require("../Models/user-model");
const { hashpassword, matchpassword } = require("../Utils/hash");
const {
  createtoken,
  refreshtoken,
  verifyrefreshtoken,
} = require("../Utils/auth");

//CREATE USER
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashpass = await hashpassword(password);

    const newUser = await User.create({
      name,
      email,
      password: hashpass,
    });

    // const accessToken = createtoken(newUser._id);
    // const refreshjwt = refreshtoken(newUser._id);

    // res.cookie("refreshToken", refreshjwt, {
    //   httpOnly: true,
    //   masAge: 7 * 24 * 60 * 60 * 1000,
    // });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existUser = await User.findOne({ email });
    if (!existUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const comparePassword = await matchpassword(password, existUser.password);
    if (!comparePassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = createtoken(existUser._id);
    const refreshjwt = refreshtoken(existUser._id);

    res.cookie("refreshToken", refreshjwt, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh token" });
    }

    const payload = verifyrefreshtoken(token);
    if (!payload) {
      return res.status(403).json({ success: false, message: "Invalid refresh token" });
    }
    const accessToken = createtoken({ id: payload.id });

    res.json({ success: true, accessToken });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res, next) => {
    try {
        res.clearCookie("refreshToken");
         res.status(200).json({
           success: true,
           message: "Logged out successfully",
         });
    } catch (err) {
        next(err);
    }

}