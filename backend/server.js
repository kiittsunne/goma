require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5001;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect db
const connectDB = require("../backend/db/db");
connectDB();

// Import routes
const UserRouter = require("./router/UserRouter");
app.use("/api", UserRouter);

app.listen(PORT, () => {
  console.log(`App is tuned in to ${PORT}`);
});
