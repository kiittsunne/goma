require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5001;
const app = express();
app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

// Connect db
const connectDB = require("../backend/db/db");
connectDB();

// Import routes
const UserRouter = require("./router/UserRouter");
app.use("/api", UserRouter);
const ItemRouter = require("./router/ItemRouter");
app.use("/api", ItemRouter);

app.listen(PORT, () => {
  console.log(`App is tuned in to ${PORT}`);
});
