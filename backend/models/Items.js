const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    name: { type: String },
    price: { type: Number },
    stock: { type: Number },
    category: { type: String },
    subCategory: { type: String },
    description: { type: String },
    dimension_enabled: { type: Boolean },
    dimension_inventory: { type: Array },
    dimension_main: { type: Object },
    dimension_sub: { type: Object },
    image: { type: String },
    seller_id: { type: String },
    seller_name: { type: String },
  },
  { collection: "Items" }
);

const Items = mongoose.model("Items", ItemSchema);
module.exports = Items;
