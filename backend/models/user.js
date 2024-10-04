const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  phone:{
    type : Number,
  },
  password: {
    type: String,
    required: true,
  },
  cart : [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      name : String,
      size : String,
      quantity : Number,
      price : {
        type : Number,
        default : null
      }, //new
    }
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

const User = mongoose.model("User", userSchema);

User.syncIndexes()
  .then(() => console.log("Indexes synchronized"))
  .catch((err) => console.error("Error syncing indexes:", err));

module.exports = User;