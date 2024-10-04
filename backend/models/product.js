const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  sizes: [{
    size : String,
    price : {
      type : Number,
      default : null
    }
  }],//new
  unit: {
    type: String, // e.g., 'packet', 'litre', 'ml', 'gram', 'kg'
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// const Product = mongoose.model("Product", productSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
module.exports = Product;
