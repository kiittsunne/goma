// Document set-up
require("dotenv").config();
const express = require("express");
const router = express.Router();

// Import Authentication & Authorization utils
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Import model
const User = require("../models/User");

// don't do this in production, it's a memory storage. it can go into redis cache
let refreshTokens = [];

router.post("/token", async (req, res) => {
  const refreshToken = req.body.token;
  // if no token from header, say missing token
  if (refreshToken == null) return res.sendStatus(401);
  // if token does not match refreshTokens[], say forbidden
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  try {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, user) => {
        if (err) res.sendStatus(403);
        const accessToken = await generateAccessToken(
          JSON.stringify({ _id: user._id, username: user.username })
        );
        res.json({ accessToken: accessToken });
      }
    );
  } catch (err) {
    res.send({ status: err.status, message: err.message });
  }
});

router.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token != req.body.token);
  res.status(204);
  console.log(refreshTokens);
});

router.post("/login", async (req, res) => {
  // check user exist
  const user = await User.findOne({ email: { $eq: req.body.email } });
  try {
    // err if user not exist
    if (!user) return res.send({ message: "No Such User." });

    if (await bcrypt.compare(req.body.password, user.hash)) {
      // generate jwt tokens for authorization
      const accessToken = await generateAccessToken(
        JSON.stringify({ _id: user._id, username: user.username })
      );
      const refreshToken = await generateRefreshToken(
        JSON.stringify({ _id: user._id, username: user.username })
      );
      refreshTokens.push(refreshToken);

      //response
      res.json({
        user: user.username,
        id: user._id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        isMaker: user.isMaker,
      });
    } else {
      res.send({ message: "Wrong Email or Password." });
    }
  } catch (err) {
    // res.send("line 73 error");
    res.send({ status: err.status, message: err.message });
  }
});

async function generateAccessToken(user) {
  return await jwt.sign(JSON.parse(user), process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3600s",
  });
}

async function generateRefreshToken(user) {
  return await jwt.sign(JSON.parse(user), process.env.REFRESH_TOKEN_SECRET);
}

module.exports = router;
