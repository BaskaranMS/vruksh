const Admin = require("../models/admin");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const config = require("../config/config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.serverEmail,
    pass: process.env.APP_PASSWORD,
  },
});

exports.createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 12);
  const user = new User({
    ...userData,
    phone: Number(userData.phone),
    password: hashedPassword,
  });
  return user.save();
};

exports.loginUser = async (userData) => {
  const ifExist = await User.findOne({
    username: userData.username,
  });
  console.log("check check : ", ifExist);
  if (!ifExist) {
    throw new Error("no user found for this username");
  }
  const isValid = await bcrypt.compare(userData.password, ifExist.password);
  if (isValid) {
    const token = jwt.sign({ id: ifExist._id }, process.env.JWT_SECRET);
    return {
      token,
      userId: ifExist._id,
      username: ifExist.username,
      phone: ifExist.phone,
      Orders: ifExist.orders,
      cart: ifExist.cart,
    };
  } else {
    throw new Error("password is incorrect");
  }
};

exports.addToCart = async (userData, productData) => {
  try {
    const user = await User.findOne({ username: userData.name });
    console.log(user);
    if (user) {
      user.cart.push({
        productId: productData.productId,
        name: productData.name,
        size: productData.size,
        price: productData.price,
        quantity: productData.quantity,
      });

      await user.save();
    }

    return user;
  } catch (error) {
    return error;
  }
};

exports.removeFromCart = async (userData, productData) => {
  console.log("from cart page request", userData, productData);
  try {
    const user = await User.findOne({ username: userData.name });
    if (user) {
      console.log(user);
      user.cart = user.cart.filter(
        (item) => item.productId.toString() !== productData.productId
      );

      await user.save();
    }

    return user;
  } catch (error) {
    return error;
  }
};

exports.updateCart = async (data) => {
  console.log(data);
  try {
    const user = await User.findOne({ _id: data.userId });
    console.log(user);
    if (user) {
      console.log("update cart : ", user);
      const cartItem = user.cart.find(
        (item) => item.productId.toString() === data.productId
      );

      if (cartItem) {
        cartItem.size = data.size || cartItem.size;
        cartItem.quantity = data.quantity || cartItem.quantity;

        await user.save();

        return { success: true, cart: user.cart };
      }

      return { success: false, message: "Item not found in cart" };
    }

    return { success: false, message: "User not found" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

exports.getCart = async (username) => {
  try {
    const user = await User.findOne({ username });
    if (user) {
      console.log(user.cart);
      return user.cart;
    }
    return null;
  } catch (error) {
    return { error: "An error occurred while fetching the cart" };
  }
};

exports.createAdmin = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 15);
  const admin = new Admin({ ...data, password: hashedPassword });
  return admin.save();
};

exports.loginAdmin = async (userData) => {
  const ifExist = await Admin.findOne({
    username: userData.username,
  });
  if (ifExist) {
    const isValid = await bcrypt.compare(userData.password, ifExist.password);
    if (isValid) {
      const token = jwt.sign({ id: ifExist._id }, process.env.JWT_SECRET, {
        expiresIn: "5h",
      });
      return { token, success: true };
    } else {
      return { data: "Invalid Password", success: false };
    }
  } else {
    return { data: "Invalid Admin id", success: false };
  }
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

exports.forgotPassword = async (userData) => {
  const ifExist = await Admin.findOne({
    username: userData.username,
  });
  console.log(ifExist);

  if (ifExist) {
    const otp = generateOTP();

    const mailOptions = {
      from: config.ServerEmail,
      to: "vrukshstores@gmail.com",
      subject: "Your OTP for Password Reset",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>OTP Verification</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    color: #333;
                }
                .email-container {
                    width: 100%;
                    background-color: #f4f4f4;
                    padding: 20px 0;
                }
                .email-wrapper {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
                    border: 1px solid #e0e0e0;
                }
                .email-header {
                    background-color: #4CAF50;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                }
                .email-body {
                    padding: 30px;
                    color: #333333;
                    line-height: 1.6;
                }
                .email-body h2 {
                    color: #4CAF50;
                    font-size: 22px;
                }
                .otp-code {
                    display: inline-block;
                    background-color: #f4f4f4;
                    color: #333;
                    padding: 10px 20px;
                    font-size: 24px;
                    font-weight: bold;
                    letter-spacing: 2px;
                    border-radius: 4px;
                    margin-top: 20px;
                }
                .email-footer {
                    background-color: #4CAF50;
                    color: #ffffff;
                    text-align: center;
                    padding: 20px;
                    font-size: 14px;
                }
                .email-footer p {
                    margin: 0;
                }
                .email-footer a {
                    color: #ffffff;
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-wrapper">
                    <div class="email-header">
                        OTP Verification
                    </div>
                    <div class="email-body">
                        <h2>Hello,</h2>
                        <p>We received a request to reset your password. Please use the OTP below to proceed with the password reset process:</p>
                        <div class="otp-code">
                            ${otp}
                        </div>
                        <p>This OTP is valid for 10 minutes.</p>
                        <p>If you did not request a password reset, please ignore this email.</p>
                        <p>Thank you,<br>The Admin Team</p>
                    </div>
                    <div class="email-footer">
                        <p>If you have any questions, feel free to <a href="mailto:webgi215.official@gmail.com">contact our support team</a>.</p>
                        <p>&copy; 2024 W E B G I. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    ifExist.resetOTP = otp.toString();
    ifExist.otpExpires = (Date.now() + 20 * 60 * 1000).toString();
    await ifExist.save();

    return { data: "OTP sent to your registered email", success: true };
  } else {
    return { data: "Invalid Admin username", success: false };
  }
};

exports.resetPassword = async (userData) => {
  const ifExist = await Admin.findOne({
    username: userData.username,
  });

  if (ifExist) {
    if (ifExist.resetOTP === userData.otp && Date.now() < ifExist.otpExpires) {
      const hashedPassword = await bcrypt.hash(userData.newPassword, 15);
      ifExist.password = hashedPassword;
      ifExist.resetOTP = undefined;
      ifExist.otpExpires = undefined;
      await ifExist.save();

      return { data: "Password successfully updated", success: true };
    } else {
      return { data: "Invalid OTP or OTP expired", success: false };
    }
  } else {
    return { data: "Invalid Admin username", success: false };
  }
};
