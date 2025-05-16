const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user_route");
const globalErrorHandler = require("./middlewares/error_handler");
const connection = require("./configs/db"); // required to import even im not using conncetion var

const app = express();
dotenv.config({ path: "./.env" });
app.use(express.json());

app.use("/users", userRoutes);

// Global Error Handling Middleware (IMPORTANT: after all routes)
app.use(globalErrorHandler);
module.exports = app;
