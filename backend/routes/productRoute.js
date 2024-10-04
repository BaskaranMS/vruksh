const express = require("express");

// const express = require("express");
// const {
//   createProduct,
//   allProduct,
//   updateProduct,
//   deleteProduct,
// } = require("../controllers/productController");
// const router = express.Router();

// router.post("/createproduct", createProduct);
// router.get("/getallproduct", allProduct);
// router.put("/alterproduct", updateProduct);
// router.delete("/deleteproduct", deleteProduct);

// module.exports = router;
const { updateProductPrices } = require("../controllers/priceUpdate");
const {
  createProduct,
  allProduct,
  updateProduct,
  deleteProduct,
  induvidualProduct,
  aggProduct,
  updateFullProduct,
  getAggregateDetails,
} = require("../controllers/productController");
const router = express.Router();

router.post("/createproduct", createProduct);
router.get("/getallproduct", allProduct);
router.get("/getindproduct", induvidualProduct);
router.put("/alterproduct", updateProduct);
router.put("/updateproduct", updateFullProduct);
router.delete("/deleteproduct", deleteProduct);
router.get("/aggregate", aggProduct);
//old
router.post("/update-prices", updateProductPrices);
router.post("/getAggregateDetails", getAggregateDetails);

module.exports = router;
