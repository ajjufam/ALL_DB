const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user_routes");
const globalErrorHandler = require("./middlewares/error_handler");

dotenv.config();
const app = express();
app.use(express.json());

app.use("/users", userRoutes);

// Global Error Handling Middleware (IMPORTANT: after all routes)
app.use(globalErrorHandler);
module.exports = app;
