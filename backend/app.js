const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoute");
const productRoutes = require("./routes/productRoute");
const orderRoutes = require("./routes/orderRoute");
const cors = require("cors");
const mongoose = require("mongoose");
const Order = require("./models/orders");

const app = express();

connectDB();

// mongoose.connection.once("open", async () => {
//   try {
//     const result = await Order.updateMany(
//       { paymentStatus: { $exists: false } },
//       { $set: { paymentStatus: "pending" } }
//     );
//     console.log(
//       `${result.nModified} orders updated with a default paymentStatus.`
//     );
//   } catch (err) {
//     console.error("Error updating orders:", err);
//   } finally {
//     mongoose.connection.close();
//   }
// });

app.use(express.json());

// const corsOptions = {
//   origin: "https://vrukshstore.vercel.app",
// };

app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cron", (req, res) => {
  console.log("cron worked app waked");
  res.send("App Waked").status(200);
});

module.exports = app;
