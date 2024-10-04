const sendMail = require("../funcions/sendMail");
const Order = require("../models/orders");
const User = require("../models/user");

exports.postOrder = async (orderData) => {
  console.log("fjofk;s", orderData);
  try {
    const newOrder = new Order(orderData);
    console.log("final", newOrder);
    await User.updateOne(
      { _id: newOrder.userId },
      {
        $push: { orders: newOrder._id },
        $set: { cart: [] },
      }
    );
    newOrder.save();
    const user = await User.find({ _id: orderData.userId });
    console.log("user finded : ", user);
    const emailData = {
      userData: {
        username: user[0].username,
        phone: user[0].phone,
      },
      newOrder,
    };
    console.log("final check : ", emailData);
    const response = await sendMail(emailData);
    console.log(response, newOrder);
    if (response.includes("email is sent!!")) {
      return newOrder;
    } else {
      return newOrder;
    }
    return newOrder;
  } catch (error) {
    console.log(error.message);
  }
};

exports.getAllOrders = async (userId) => {
  try {
    const orders = await Order.find({
      userId: userId,
      status: "ordered",
    }).sort({ orderDate: -1 });

    return { success: true, orders };
  } catch (error) {
    console.log(error.message);
    return { success: false, message: error.message };
  }
};

exports.getAllOrder = async () => {
  try {
    const allOrders = await Order.find().sort({ orderDate: -1 });
    const enrichOrderWithUser = async (order) => {
      try {
        const user = await User.findById(order.userId);
        if (user) {
          return {
            ...order._doc,
            username: user.username,
            phone: user.phone,
          };
        } else {
          return {
            ...order._doc,
            username: null,
            phone: null,
          };
        }
      } catch (error) {
        console.error(Error`fetching user for order ${order._id}:`, error);
        return {
          ...order._doc,
          username: null,
          phone: null,
        };
      }
    };

    const enrichedOrders = await Promise.all(
      allOrders.map(enrichOrderWithUser)
    );
    return enrichedOrders;
  } catch (error) {
    console.log("Error fetching orders:", error);
  }
};

exports.orderUpdate = async (data) => {
  try {
    const updated = await Order.updateOne(
      { _id: data._id },
      { status: "delivered" }
    );
    return updated;
  } catch (error) {
    console.log(error.message);
  }
};

exports.deleteOrder = async (id) => {
  try {
    const response = await Order.deleteOne({ _id: id });
    return response;
  } catch (error) {
    console.log(error.message);
  }
};
