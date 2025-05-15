const bcrypt = require("bcryptjs");
const User = require("../models/user_model");
const AppError = require("../utils/app_error");
const { createUserValid } = require("../validations/user_validation");

exports.createUser = async (req, res, next) => {
  try {
    // Validate input using Joi
    const { error, value } = createUserValid.validate(req.body);
    if (error || !value)
      return next(new AppError(error.details[0].message, 400));

    // Only destructure after validation passes
    const { confirmpass, ...userData } = value;

    // Check if user already exists
    const emailExist = await User.findOne({ email: userData.email });
    const phoneExist = await User.findOne({ phone: userData.phone });

    if (emailExist || phoneExist)
      return next(new AppError("User Already Exist", 409));

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    // Save new user
    const user = await User.create(userData);

    // Respond
    res.status(201).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error); // Forward any unexpected errors to global handler
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users || users.length <= 0)
      return next(new AppError("Users not found", 404));

    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
