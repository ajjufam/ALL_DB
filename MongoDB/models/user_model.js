const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
});

const userModel = mongoose.model("User", UserSchema);
module.exports = userModel;
