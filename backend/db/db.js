require("dotenv").config();
const mongoose = require("mongoose");

let URI = process.env.URI;

const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("DB connected");
  } catch (err) {
    console.log(err.message);
    process.exit();
  }
};

module.exports = connectDB;
