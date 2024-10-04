// const express = require('express');
// const orderController = require('../controllers/orderController');
// const router = express.Router();

// router.post('/placeOrder', orderController.postNewOrder);
// router.get('/getuserorders', orderController.getUserOrders);

// module.exports = router;
const express = require("express");
const orderController = require("../controllers/orderController");
const router = express.Router();

router.post("/placeOrder", orderController.postNewOrder);
router.get("/getAllOrder", orderController.getOrder);
router.put("/updateOrder", orderController.updateOrder);
router.get("/getuserorders", orderController.getUserOrders);
router.delete("/deleteOrder/:orderId", orderController.deleteAdminOrder);

module.exports = router;
