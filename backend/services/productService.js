// const Product = require("../models/product");

// exports.postProduct = async (data) => {
//   try {
//     const product = await Product.create(data);
//     return product;
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.getProduct = async () => {
//   try {
//     const allProduct = await Product.find().sort({ createdAt : -1 });
//     return allProduct;
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.changeProduct = async (data) => {
//   try {
//     const response = await Product.updateOne(
//       { _id: data._id },
//       { name: data.name, size: data.size, unit: data.unit }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.removeProduct = async (data) => {
//   try {
//     const response = await Product.deleteOne({ _id: data._id });
//     console.log("done");
//     console.log(response);
//   } catch (error) {
//     console.log(error);
//   }
// };

const Order = require("../models/orders");
const Product = require("../models/product");
const User = require("../models/user");
const mongoose = require("mongoose");

exports.postProduct = async (data) => {
  try {
    const product = await Product.create(data);
    return product;
  } catch (error) {
    console.log(error);
  }
};

exports.getProduct = async () => {
  try {
    const allProduct = await Product.find().sort({ createdAt: -1 });
    return allProduct;
  } catch (error) {
    console.log(error);
  }
};

const updateOrderPrices = async (productId, updatedSizes, data) => {
  console.log("getting the month data");
  console.log(data);
  console.log("Updating orders for product ID:", productId);
  console.log("Updated sizes:", updatedSizes);

  try {
    const { startOfMonth } = data;
    const { endOfMonth } = data;
    console.log(startOfMonth);
    console.log(endOfMonth);

    const orders = await Order.find({
      "products.productId": productId,
      orderDate: { $gte: startOfMonth, $lte: endOfMonth },
    });

    console.log("Orders found:", orders.length);

    for (const order of orders) {
      let orderUpdated = false;

      // Reset totalPrice to 0
      order.totalPrice = 0;

      for (const product of order.products) {
        if (product.productId.toString() === productId.toString()) {
          const updatedSize = updatedSizes.find(
            (size) => size.size === product.size
          );

          if (updatedSize) {
            // Convert price to number and check if it's valid
            const newPrice = parseFloat(updatedSize.price);
            if (isNaN(newPrice)) {
              console.warn(
                `Invalid price value for size ${updatedSize.size}: ${updatedSize.price}`
              );
              continue; // Skip updating this size if the price is invalid
            }

            if (newPrice !== product.price) {
              console.log(
                `Updating product ID: ${productId}, Size: ${product.size}, Old Price: ${product.price}, New Price: ${newPrice}`
              );

              product.price = newPrice; // Update the price
              product.unit = updatedSize.unit || product.unit; // Update unit if available
              orderUpdated = true;
            }
          }
        }

        // Recalculate the total price for the order
        if (product.price) {
          order.totalPrice += product.price * product.quantity;
        }
      }

      if (orderUpdated) {
        console.log("Updated order totalPrice:", order.totalPrice);

        await order.save(); // Save the specific order instance
        console.log("Order saved:", order._id);
      } else {
        console.log("No updates made to this order");
      }
    }
  } catch (error) {
    console.log("Error updating order prices:", error);
    throw new Error("Failed to update order prices");
  }
};

// Function to handle product changes and update orders

exports.updatePro = async (data) => {
  console.log("service level");
  console.log(data);
  try {
    const response = await Product.updateOne(
      {
        _id: data._id,
      },
      {
        name: data.name,
        sizes: data.sizes,
        unit: data.unit,
        category: data.category,
      }
    );
    console.log(response);
    if (response) {
      return response;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

exports.changeProduct = async (data) => {
  console.log("this is change product");
  console.log(data);
  try {
    console.log("Updating product with ID:", data._id);

    // Convert price strings to numbers before updating the product
    data.sizes = data.sizes.map((size) => ({
      ...size,
      price: parseFloat(size.price) || 0, // Convert price to number, default to 0 if invalid
    }));

    const response = await Product.updateOne(
      { _id: data._id },
      {
        name: data.name,
        sizes: data.sizes,
        unit: data.unit,
        category: data.category,
      }
    );

    console.log("Product update response:", response);

    if (response.modifiedCount > 0) {
      console.log("Product update successful, updating related orders...");
      await updateOrderPrices(data._id, data.sizes, data);
    } else {
      console.log("Product was not modified.");
    }

    return response;
  } catch (error) {
    console.log("Error updating product:", error);
    throw new Error("Failed to update product");
  }
};

exports.removeProduct = async (data) => {
  console.log(data);
  try {
    const response = await Product.deleteOne({ _id: data._id });
    console.log("done");
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

// exports.aggregateProduct = async (month, year) => {
//   try {
//     // const startDate = new Date(year, month - 1, 1);
//     // const endDate = new Date(year, month, 1);

//     const startDate = new Date(2024, 7, 15);
//     const endDate = new Date(2024, 8, 15);
//     //

//     const aggregatedProducts = await Order.aggregate([
//       {
//         $match: {
//           orderDate: { $gte: startDate, $lt: endDate },
//         },
//       },
//       { $unwind: "$products" }, // Deconstruct the products array field
//       {
//         $group: {
//           _id: {
//             productId: "$products.productId",
//             size: "$products.size",
//           }, // Group by productId and size
//           totalQuantity: { $sum: "$products.quantity" }, // Sum the quantities
//           name: { $first: "$products.name" }, // Take the first product name
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           productId: "$_id.productId",
//           name: 1,
//           size: "$_id.size",
//           totalQuantity: 1,
//         },
//       },
//       { $sort: { name: 1 } }, // Sort by product name in ascending order
//     ]);

//     return {
//       products: aggregatedProducts,
//     };
//   } catch (error) {
//     console.error("Error in aggregateProduct:", error);
//     return null;
//   }
// };

exports.aggregateProduct = async (start, end) => {
  try {
    const aggregatedProducts = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: start, $lt: end },
        },
      },
      { $unwind: "$products" },
      {
        $group: {
          _id: {
            productId: "$products.productId",
            size: "$products.size",
          },
          totalQuantity: { $sum: "$products.quantity" },
          name: { $first: "$products.name" },
        },
      },
      {
        $project: {
          _id: 0,
          productId: "$_id.productId",
          name: 1,
          size: "$_id.size",
          totalQuantity: 1,
        },
      },
      { $sort: { name: 1 } },
    ]);

    return {
      products: aggregatedProducts,
    };
  } catch (error) {
    console.error("Error in aggregateProduct:", error);
    return null;
  }
};

// exports.getAggregateProductsDetails = async (details) => {
//   try {
//     console.log("first");
//     const { productId, size, start, end, month, year } = details;

//     let matchCondition = {
//       "products.productId": productId,
//     };

//     if (size) {
//       matchCondition["products.size"] = size;
//     }

//     if (month && year) {
//       matchCondition.orderDate = {
//         $gte: new Date(`${year}-${month}-01`), // Start of the month
//         $lt: new Date(`${year}-${Number(month) + 1}-01`), // Start of the next month
//       };
//     }

//     if (start && end) {
//       matchCondition.orderDate = {
//         $gte: new Date(start), // Start date
//         $lte: new Date(end), // End date
//       };
//     }
//     console.log(matchCondition);
//     const result = await Order.aggregate([
//       { $match: matchCondition },
//       { $unwind: "$products" },
//       { $match: { "products.productId": productId } },
//       {
//         $group: {
//           _id: "$userId",
//           totalQuantity: { $sum: "$products.quantity" },
//         },
//       },
//       {
//         $lookup: {
//           from: "User",
//           localField: "_id",
//           foreignField: "_id",
//           as: "userDetails",
//         },
//       },
//       {
//         $unwind: "$userDetails",
//       },
//       {
//         $project: {
//           userId: "$_id",
//           userName: "$userDetails.username",
//           totalQuantity: 1,
//         },
//       },
//     ]);
//     console.log(result);
//     return result;
//   } catch (error) {
//     console.error(
//       "Error occurred while getting aggregate product details...",
//       error
//     );
//     return null;
//   }
// };
exports.getAggregateProductsDetails = async (details) => {
  try {
    console.log("first");
    // Extracting the parameters from details
    const { productId, size, start, end, month, year } = details;

    const objectIdProductId = new mongoose.Types.ObjectId(productId);

    // Creating the match condition based on the inputs
    let matchCondition = {
      "products.productId": objectIdProductId,
    };

    // If size is provided, add it to the match condition
    if (size) {
      matchCondition["products.size"] = size;
    }

    // Initialize an array to hold date conditions
    const dateConditions = [];

    // Filter by month & year if they are provided
    if (month && year) {
      const startDate = new Date(`${year}-${month}-01T00:00:00Z`); // Start of the given month
      const endDate = new Date(`${year}-${Number(month) + 1}-01T00:00:00Z`); // Start of the next month
      dateConditions.push({
        orderDate: {
          $gte: startDate,
          $lt: endDate,
        },
      });
    }

    // Filter by start and end date if provided
    if (start && end) {
      dateConditions.push({
        orderDate: {
          $gte: new Date(start),
          $lte: new Date(end),
        },
      });
    }

    // Combine date conditions if they exist
    if (dateConditions.length > 0) {
      matchCondition.$or = dateConditions; // Use $or to combine date filters
    }

    console.log(matchCondition);

    // Perform the aggregation query
    const result = await Order.aggregate([
      { $match: matchCondition }, // Match the product and date range
      { $unwind: "$products" }, // Unwind the products array
      { $match: { "products.productId": objectIdProductId } }, // Ensure productId matches after unwind
      {
        $group: {
          _id: "$userId", // Group by userId
          totalQuantity: { $sum: "$products.quantity" }, // Sum up the quantities for this product
        },
      },
      {
        $lookup: {
          from: "users", // The users collection (note: 'users' is the actual collection name)
          localField: "_id", // Matching with the userId (_id in this context)
          foreignField: "_id", // User's _id field
          as: "userDetails", // Store the result in userDetails array
        },
      },
      { $unwind: "$userDetails" }, // Unwind the userDetails array to access the fields
      {
        $project: {
          userId: "$_id", // The userId of the purchaser
          userName: "$userDetails.username", // The username from the User model
          totalQuantity: 1, // The total quantity purchased by this user
        },
      },
    ]);

    // Logging the result to check the output
    console.log(result);

    // Return the result to the caller
    return result;
  } catch (error) {
    console.error(
      "Error occurred while getting aggregate product details...",
      error
    );
    return null; // Return null in case of an error
  }
};
