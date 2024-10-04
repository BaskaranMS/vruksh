// const { updateOrderPrices } = require('../services/priceUpdateService');
// const Product = require('../models/Product');

// exports.updateProductPrices = async (req, res) => {
//   const { products, startDate, endDate } = req.body;

//   try {
//     for (const product of products) {
//       // Update the product prices in the database
//       const updatedProduct = await Product.findByIdAndUpdate(
//         product._id,
//         {
//           $set: {
//             sizes: product.sizes, // Update the sizes array with new prices
//           },
//         },
//         { new: true }
//       );

//       if (!updatedProduct) {
//         return res.status(404).json({
//           success: false,
//           msg: `Product with ID ${product._id} not found`,
//         });
//       }

//       // Update the orders that include this product within the specified date range
//       await updateOrderPrices(product._id, product.sizes, startDate, endDate);
//     }

//     res.status(200).json({
//       success: true,
//       msg: 'Product prices and associated orders updated successfully',
//     });
//   } catch (error) {
//     console.error('Error updating product prices:', error);
//     res.status(500).json({
//       success: false,
//       msg: 'Failed to update product prices',
//     });
//   }
// };
const { updateOrderPrices } = require('../services/priceUpdateService');
const Product = require('../models/product');

exports.updateProductPrices = async (req, res) => {
  const { products, startDate, endDate } = req.body;

  try {
    // Prepare the bulk operations
    const bulkOperations = products.map(product => ({
      updateOne: {
        filter: { _id: product._id },
        update: {
          $set: {
            sizes: product.sizes, // Update the sizes array with new prices
          },
        },
      },
    }));

    console.log('bulk operations : ', bulkOperations);
    
    // Execute the bulk write operation
    const result = await Product.bulkWrite(bulkOperations);

    if (result.nModified === 0) {
      return res.status(404).json({
        success: false,
        msg: 'No products were updated',
      });
    }

    // Update the orders that include these products within the specified date range
    for (const product of products) {
      await updateOrderPrices(product._id, product.sizes, startDate, endDate);
    }

    res.status(200).json({
      success: true,
      msg: 'Product prices and associated orders updated successfully',
    });
  } catch (error) {
    console.error('Error updating product prices:', error);
    res.status(500).json({
      success: false,
      msg: 'Failed to update product prices',
    });
  }
};
