const User = require("../models/user");
const userService = require("../services/userService");

exports.registerUser = async (req, res) => {
  try {
    const { password, phone } = req.body;

    if (password.length < 8 || phone.length !== 10) {
      return res.status(400).json({
        success: false,
        message:
          "Provide a valid phone number or password. Password must be at least 8 characters long, and the phone number must be 10 digits.",
      });
    }

    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue).join(", ");
      let errorMessage = "";
      if (duplicateField.includes("username")) {
        errorMessage += "Username is already taken.";
      }
      if (duplicateField.includes("phone")) {
        errorMessage += " Phone number is already in use.";
      }
      res.status(400).json({ success: false, message: `${errorMessage}` });
    } else {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

exports.adminCreate = async (req, res) => {
  try {
    if (req.body.password.length !== 8) {
      return res
        .status(400)
        .json({ sucess: false, message: "invalid admin credentials" });
    }
    const admin = await userService.createAdmin(req.body);
    res.status(201).json({ success: true, data: admin });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.userLogin = async (req, res) => {
  console.log(req.body);
  try {
    const response = await userService.loginUser(req.body);
    if (response) {
      // save the data in localstorage
      res.status(200).json({
        success: true,
        data: response,
      });
    } else {
      res.status(500).json({ success: false, data: "invalid Credentials" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  const { userData, productData } = req.body;

  try {
    console.log(userData, productData);
    const response = await userService.addToCart(userData, productData);
    res.status(200).json({ success: true, msg: response });
  } catch (error) {
    res.status(400).json({ success: false, msg: error });
  }
};

exports.removeFromCart = async (req, res) => {
  const { userData, productData } = req.body;

  try {
    console.log(userData, productData);
    const response = await userService.removeFromCart(userData, productData);
    res.status(200).json({ success: true, msg: response });
  } catch (error) {
    res.status(400).json({ success: false, msg: error });
  }
};

exports.updateCart = async (req, res) => {
  const { modalData } = req.body;
  console.log(req.body);

  try {
    const response = await userService.updateCart(req.body.modalData);
    res.status(200).json({ success: true, msg: response });
  } catch (error) {
    res.status(400).json({ success: false, msg: error });
  }
};

exports.getCart = async (req, res) => {
  const username = req.query.username;

  try {
    console.log(username);
    const response = await userService.getCart(username);
    res.status(200).json({ success: true, msg: response });
  } catch (error) {
    res.status(400).json({ success: false, msg: error });
  }
};

//new

exports.adminLogin = async (req, res) => {
  try {
    const response = await userService.loginAdmin(req.body);
    if (response.success) {
      res.status(200).json({
        success: true,
        data: { token: response, name: req.body.username },
      });
    } else {
      res.status(500).json({ success: false, data: response.data });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.adminSendOtp = async (req, res) => {
  console.log(req.body);
  try {
    const response = await userService.forgotPassword(req.body);
    console.log(response);
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(500).json(response);
    }
  } catch (error) {
    res.status(411).json({
      success: false,
      data: "nodemailer error",
    });
  }
};

exports.adminResetPass = async (req, res) => {
  try {
    // username , otp , newpass
    const response = await userService.resetPassword(req.body);
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(500).json(response);
    }
  } catch (error) {
    res.status(411).json({
      success: false,
      data: "nodemailer error",
    });
  }
};
