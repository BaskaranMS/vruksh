const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.userLogin);
router.put('/addtocart', userController.addToCart);
router.put('/removefromcart', userController.removeFromCart);
router.get('/getcart', userController.getCart);
router.put('/updatecart', userController.updateCart);

// router.post("/admin", userController.adminCreate);
// router.post("/adminlogin", userController.adminLogin);
router.post("/admin", userController.adminCreate);
router.post("/adminlogin", userController.adminLogin);

router.post("/admin-forgetpassword", userController.adminSendOtp);
router.post("/admin-resetpassword", userController.adminResetPass);

module.exports = router;
