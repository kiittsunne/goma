// Adapted from wds_userauth

// Document set-up
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.AUTH_PORT || 5002;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect db
const connectDB = require("../backend/db/db");
connectDB();

// Import routes
const AuthRouter = require("./router/AuthRouter");
app.use("/api", AuthRouter);

app.listen(PORT, () => {
  console.log(`App is tuned into port ${PORT}`);
});
