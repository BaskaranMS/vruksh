// // const {
// //   postProduct,
// //   changeProduct,
// //   removeProduct,
// // } = require("../services/productService");
// // const { getProduct } = require("../services/productService");
// const {
//   postProduct,
//   changeProduct,
//   removeProduct,
//   getInduvidualProduct,
//   aggregateProduct,
//   updatePro,
// } = require("../services/productService");
// const { getProduct } = require("../services/productService");

// // exports.createProduct = async (req, res) => {
// //   try {
// //     const response = await postProduct(req.body);
// //     if (response) {
// //       res.status(200).json({
// //         success: true,
// //         msg: response,
// //       });
// //     } else {
// //       res.status(500).json({
// //         success: false,
// //         msg: "item already exist",
// //       });
// //     }
// //   } catch (error) {
// //     res.status(400).json({
// //       success: false,
// //       msg: error.message,
// //     });
// //   }
// // };
// exports.createProduct = async (req, res) => {
//   try {
//     const response = await postProduct(req.body);
//     if (response) {
//       res.status(200).json({
//         success: true,
//         msg: response,
//       });
//     } else {
//       res.status(500).json({
//         success: false,
//         msg: "item already exist",
//       });
//     }
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       msg: error.message,
//     });
//   }
// };

// exports.allProduct = async (req, res) => {
//   try {
//     const response = await getProduct();
//     console.log(response);
//     res.status(200).json({
//       success: true,
//       msg: response,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       msg: error.message,
//     });
//   }
// };

// // exports.updateProduct = async (req, res) => {
// //   try {
// //     const response = await changeProduct(req.body);
// //     console.log(response);
// //     res.status(200).json({
// //       success: true,
// //       msg: response,
// //     });
// //   } catch (error) {
// //     res.status(400).json({
// //       success: false,
// //       msg: error.message,
// //     });
// //   }
// // };

// // exports.deleteProduct = async (req, res) => {
// //   try {
// //     const response = await removeProduct(req.body);
// //     console.log(response);
// //     res.status(200).json({
// //       success: true,
// //       msg: response,
// //     });
// //   } catch (error) {
// //     res.status(400).json({
// //       success: false,
// //       msg: error.message,
// //     });
// //   }
// // };
const {
  postProduct,
  changeProduct,
  removeProduct,
  getInduvidualProduct,
  aggregateProduct,
  updatePro,
  getAggregateProductsDetails,
} = require("../services/productService");
const { getProduct } = require("../services/productService");

exports.createProduct = async (req, res) => {
  try {
    const response = await postProduct(req.body);
    if (response) {
      res.status(200).json({
        success: true,
        msg: response,
      });
    } else {
      res.status(500).json({
        success: false,
        msg: "item already exist",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

exports.allProduct = async (req, res) => {
  try {
    const response = await getProduct();
    res.status(200).json({
      success: true,
      msg: response,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

exports.induvidualProduct = async (req, res) => {
  try {
    const response = await getInduvidualProduct(req.body);
    if (response.success) {
      res.status(200).json({ status: true, data: response });
    } else {
      res.status(411).json({ success: false, data: response });
    }
  } catch (error) {
    res.status(411).json({ success: false, data: "error occured" });
  }
};

exports.updateProduct = async (req, res) => {
  console.log("this is updated body : ");
  console.log(req.body);
  try {
    console.log(req.body);
    const response = await changeProduct(req.body);
    console.log(response);
    res.status(200).json({
      success: true,
      msg: response,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

exports.updateFullProduct = async (req, res) => {
  console.log("this is controller");
  console.log(req.body);
  try {
    const response = await updatePro(req.body);
    if (response) {
      res.status(200).json({ success: true, data: response });
    } else {
      res.status(411).json({ success: false, data: null });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const response = await removeProduct(req.body);
    console.log(response);
    res.status(200).json({
      success: true,
      msg: response,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      msg: error.message,
    });
  }
};

// exports.aggProduct = async (req, res) => {
//   try {
//     // const { month, year } = req.query;

//     const response = await aggregateProduct(month, year);

//     if (!response) {
//       return res
//         .status(500)
//         .json({ success: false, msg: "Error occurred during aggregation" });
//     }

//     res.status(200).json({
//       success: true,
//       data: response.products,
//     });
//   } catch (error) {
//     res
//       .status(500) // Changed status code to 500
//       .json({ success: false, msg: "Error occurred during aggregation" });
//   }
// };

exports.aggProduct = async (req, res) => {
  try {
    const { month, year, startDate, endDate } = req.query;

    let start, end;

    if (month && year) {
      start = new Date(year, month - 1, 1);
      end = new Date(year, month, 1);
    } else if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      const now = new Date();
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    const response = await aggregateProduct(start, end);

    if (!response) {
      return res
        .status(500)
        .json({ success: false, msg: "Error occurred during aggregation" });
    }

    res.status(200).json({
      success: true,
      data: response.products,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, msg: "Error occurred during aggregation" });
  }
};

exports.getAggregateDetails = async (req, res) => {
  console.log(req.body);

  try {
    const response = await getAggregateProductsDetails(req.body);
    console.log("vayo");
    console.log(response);
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error occured while fetching aggregate product details.",
    });
  }
};
