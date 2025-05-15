const express = require("express");
const dotenv = require("dotenv");
const connection = require("./configs/db_config");
const globalErrorHandler = require("./middleware/error_handler");
const userRoute = require("./routes/user.route");

dotenv.config();
const app = express();
app.use(express.json());

app.use("/users", userRoute);

// DB connection
connection();

// Global Error Handling Middleware (IMPORTANT: after all routes)
app.use(globalErrorHandler);
module.exports = app;
