// const Order = require("../models/orders");

// const updateOrderPrices = async (productId, updatedSizes, startDate, endDate) => {
//     console.log("Updating orders for product ID:", productId);
//     console.log("Updated sizes:", updatedSizes);
//     console.log("Start Date:", startDate);
//     console.log("End Date:", endDate);

//     try {
//         const startOfMonth = new Date(startDate);
//         const endOfMonth = new Date(endDate);

//         // console.log("Start of Month:", startOfMonth);
//         // console.log("End of Month:", endOfMonth);

//         // Find all orders containing the product within the specified date range
//         const orders = await Order.find({
//             "products.productId": productId,
//             orderDate: { $gte: startOfMonth, $lte: endOfMonth },
//         });

//         // console.log("Orders found:", orders);

//         for (const order of orders) {
//             let orderUpdated = false;

//             // Reset totalPrice to 0
//             order.totalPrice = 0;

//             // Loop through the products in the order
//             for (const product of order.products) {
//                 if (product.productId.toString() === productId.toString()) {
//                     const updatedSize = updatedSizes.find(
//                         (size) => size.size === product.size
//                     );

//                     if (updatedSize) {
//                         // Convert price to a number and validate it
//                         const newPrice = parseFloat(updatedSize.price);
//                         if (isNaN(newPrice)) {
//                             console.warn(
//                                 `Invalid price value for size ${updatedSize.size}: ${updatedSize.price}`
//                             );
//                             continue; // Skip updating this size if the price is invalid
//                         }

//                         if (newPrice !== product.price) {
//                             console.log(
//                                 `Updating product ID: ${productId}, Size: ${product.size}, Old Price: ${product.price}, New Price: ${newPrice}`
//                             );

//                             product.price = newPrice; // Update the price
//                             product.unit = updatedSize.unit || product.unit; // Update unit if available
//                             orderUpdated = true;
//                         }
//                     }
//                 }

//                 // Recalculate the total price for the order
//                 if (product.price) {
//                     order.totalPrice += product.price * product.quantity;
//                 }
//             }

//             if (orderUpdated) {
//                 console.log("Updated order totalPrice:", order.totalPrice);

//                 const savedOrder = await order.save(); // Save the updated order
//                 console.log("Order saved:", savedOrder._id);
//             } else {
//                 console.log("No updates made to this order");
//             }
//         }
//     } catch (error) {
//         console.log("Error updating order prices:", error);
//         throw new Error("Failed to update order prices");
//     }
// };

// module.exports = {
//     updateOrderPrices,
// };
const { default: mongoose } = require("mongoose");
const Order = require("../models/orders");

const updateOrderPrices = async (
  productId,
  updatedSizes,
  startDate,
  endDate
) => {
  console.log("price check", productId, updatedSizes, startDate, endDate);
  try {
    const startOfDay = new Date(startDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(endDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    console.log(startOfDay, endOfDay);
    // Find all orders containing the product within the specified date range
    const orders = await Order.find({
      "products.productId": productId,
      orderDate: { $gte: startOfDay, $lte: endOfDay },
    });

    if (orders.length === 0) {
      console.log("No matching orders found for the product and date range");
      return;
    }

    console.log(`Found ${orders.length} orders to update`);

    // Prepare bulk operations for updating orders
    const bulkOperations = orders
      .map((order) => {
        let orderUpdated = false;
        let newTotalPrice = 0;

        // Loop through the products in the order
        order.products.forEach((product) => {
          if (product.productId.toString() === productId.toString()) {
            const updatedSize = updatedSizes.find(
              (size) => size.size === product.size
            );

            if (updatedSize) {
              const newPrice = parseFloat(updatedSize.price);
              if (!isNaN(newPrice) && newPrice !== product.price) {
                product.price = newPrice;
                product.unit = updatedSize.unit || product.unit;
                orderUpdated = true;
              }
            }
          }

          // Calculate the total price for the order
          if (product.price) {
            newTotalPrice += product.price * product.quantity;
          }
        });

        if (orderUpdated) {
          return {
            updateOne: {
              filter: { _id: order._id },
              update: {
                $set: { products: order.products, totalPrice: newTotalPrice },
              },
            },
          };
        } else {
          return null; // Skip if no updates are made
        }
      })
      .filter((op) => op !== null); // Remove null operations

    if (bulkOperations.length > 0) {
      const result = await Order.bulkWrite(bulkOperations);
      console.log("Orders updated:", result.nModified);
    } else {
      console.log("No orders were updated");
    }
  } catch (error) {
    console.log("Error updating order prices:", error);
    throw new Error("Failed to update order prices");
  }
};

module.exports = {
  updateOrderPrices,
};
