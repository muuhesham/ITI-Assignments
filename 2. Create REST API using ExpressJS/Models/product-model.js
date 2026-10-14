const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: 0,
  },
  category: {
    type: String,
    default: "general",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
},{
    timestamps: true,
});

const product = mongoose.model('product', productSchema);
module.exports = product;