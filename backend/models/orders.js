const mongoose = require("mongoose");

const orderProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  name: {
    type: String,
  },
  size: {
    type: String,
    default : ''
  },
  quantity: {
    type: Number,
    default: 1,
  },
  price : {
    type : Number,
    default : null
  }, //new
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [orderProductSchema],
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["ordered", "delivered"],
    default: "ordered",
  },
  totalPrice : {
    type : Number,
    default : null
  },// new
  paymentStatus: {
    type: String,
    enum: ["received", "pending", "returned"],
    default: "pending",
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
