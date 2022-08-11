// Document set-up
require("dotenv").config();
const { cloudinary } = require("../utils/cloudinary");
const express = require("express");
const router = express.Router();
// const multer = require("multer");

// Import Authentication & Authorization utils
const bcrypt = require("bcrypt");
const auth = require("../middlewares/auth");

// Import model
const Item = require("../models/Items");

// ====================== Routes ====================== //

// Create new item
router.put("/items", auth, async (req, res) => {
  try {
    const fileStr = req.body.image;
    const uploadRes = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "dev_setups",
    });
    const createdItem = new Item({
      category: req.body.category,
      subCategory: req.body.subCategory,
      description: req.body.description,
      dimension_enabled: req.body.dimension_enabled,
      dimension_main: req.body.dimension_main,
      dimension_sub: req.body.dimension_sub,
      dimension_inventory: req.body.dimension_inventory,
      image: uploadRes.secure_url,
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
      seller_id: req.body.seller_id,
      seller_name: req.body.seller_name,
    });
    await createdItem.save();
    res.status(200).send({ status: 201, message: "Listing created" });
  } catch (error) {
    res.send({ message: error });
  }
});

// Get all items under 1 seller
router.get("/items/:seller_id", auth, async (req, res) => {
  try {
    const data = await Item.find({ seller_id: req.params.seller_id });
    res.status(200).send({ status: 200, data: data });
  } catch (err) {
    res.send({ status: err.status, message: err.message });
  }
});

// get items by category
router.get("/items/category/:category", auth, async (req, res) => {
  try {
    const data = await Item.find({ category: req.params.category });
    res.status(200).send({ status: 200, data: data });
  } catch (err) {
    res.send({ status: err.status, message: err.message });
  }
});

// update a single item
router.patch("/items/update/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    const result = await Item.findByIdAndUpdate(id, updates);
    res.send({ status: 200, data: result, message: "Listing updated" });
  } catch (error) {
    console.log(error.message);
  }
});

// delete a single item
router.delete("/items/delete/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Item.findByIdAndDelete(id);
    res.send({ status: 200, data: result, message: "Listing deleted" });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
