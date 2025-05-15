const express = require("express");
const router = express.Router();
const { createUser, getUsers } = require("../controllers/user_controller");

router.post("/create-user", createUser);
router.get("/all-users", getUsers);

module.exports = router;
