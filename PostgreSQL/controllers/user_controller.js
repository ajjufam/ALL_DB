const pool = require("../configs/db.config");
const bcrypt = require("bcrypt");
const { createUserValid } = require("../validations/user_validation");
const AppError = require("../utils/app_error");

const userExist = async (email) => {
  const res = await pool.query("SELECT * FROM users WHERE email=$1", [email]);

  return res.rowCount > 0;
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

    // Auto-generate keys and placeholders
    const keys = Object.keys(userData); // ['name', 'email', 'password', ...]
    const values = Object.values(userData); // actual values
    const placeholders = keys.map((_, idx) => `$${idx + 1}`); // ['$1', '$2', ...]

    // Insert new user into DB
    const insertQuery = `
      INSERT INTO users (${keys.join(", ")})
      VALUES (${placeholders.join(", ")})
      RETURNING id, name, email, password;
    `;

    const { rows } = await pool.query(insertQuery, values);

    res.status(201).json({
      status: "success",
      data: rows[0],
    });
  } catch (error) {
    next(error);
  }
};
