const connection = require("../configs/db");
const bcrypt = require("bcrypt");
const { createUserValid } = require("../validations/user_validations");
const AppError = require("../utils/app_error");

const userExist = async (email) => {
  const [rows] = await connection.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows.length > 0;
};

exports.createUser = async (req, res, next) => {
  try {
    // Validate input
    const { error, value } = createUserValid.validate(req.body);
    if (error || !value)
      return next(new AppError(error.details[0].message, 400));

    // Destructure validated values
    const { confirmpass, ...userData } = value;

    // Check for existing user
    const exists = await userExist(value.email);
    if (exists) return next(new AppError("User Already exists", 409));

    // Hash password
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    // Prepare keys and values for insertion
    const keys = Object.keys(userData);
    const values = Object.values(userData);
    const placeholders = keys.map(() => "?");

    // Insert query without RETURNING (not supported in MySQL)
    const insertQuery = `
      INSERT INTO users (${keys.join(", ")})
      VALUES (${placeholders.join(", ")});
    `;

    const [result] = await connection.query(insertQuery, values);

    // Optionally fetch the newly inserted user by ID
    const [newUserRows] = await connection.query(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      status: "success",
      data: newUserRows[0],
    });
  } catch (error) {
    next(error);
  }
};
