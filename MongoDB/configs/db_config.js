const mongoose = require("mongoose");
const connection = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("mongoDB connected successfully"))
    .catch((e) => console.log("Error while connecting to mongoDB", e.message));
};

module.exports = connection;
