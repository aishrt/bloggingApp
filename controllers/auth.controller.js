const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { User } = require("../models");
const { tokenService } = require("../services");
const validator = require("validator");

const register = catchAsync(async (req, res) => {
  try {
    if (!validator.isEmail(req.body.email)) {
      return res.status(401).json({
        status: "401",
        message: `Invalid email address !`,
      });
    }
    if (await User.isEmailTaken(req.body.email)) {
      return res.status(401).json({
        status: "401",
        message: `Email already registered !`,
      });
    }
    if (req.body.password.length < 8) {
      return res.status(401).json({
        status: "401",
        message: `Invalid Password !`,
      });
    }
    if (
      !req.body.password.match(/\d/) ||
      !req.body.password.match(/[a-zA-Z]/)
    ) {
      return res.status(401).json({
        status: "401",
        message: `Password must contain at least one letter and one digit!`,
      });
    }

    const user = await User.create(req.body);
    return res.status(200).json({
      status: "200",
      message: `User registered successfully.`,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while registering the user.",
      error: error.message,
    });
  }
});

const login = catchAsync(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "400",
        message: `User not found !`,
      });
    }
    if (!(await user.isPasswordMatch(password))) {
      return res.status(400).json({
        status: "400",
        message: "Incorrect password !",
      });
    }
    const tokens = await tokenService.generateAuthTokens(user);
    return res.status(200).json({
      status: "200",
      message: `User logged in successfully.`,
      data: { user, tokens },
    });
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while login !",
      error: error.message,
    });
  }
});

const me = catchAsync(async (req, res) => {
  try {
    const userId = req.user;
    const userDetail = await User.findById(userId);
    res.status(httpStatus.OK).send(userDetail);
  } catch (error) {
    return res.status(500).json({
      status: "500",
      message: "An error occurred while login !",
      error: error.message,
    });
  }
});

module.exports = {
  register,
  login,
  me,
};
