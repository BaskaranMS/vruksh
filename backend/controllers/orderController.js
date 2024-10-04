const orderService = require("../services/orders");

exports.getUserOrders = async (req, res) => {
  const { userId } = req.query;
  console.log(userId);

  try {
    const response = await orderService.getAllOrders(userId);
    res.status(200).json({ success: true, msg: response });
  } catch (error) {
    console.log("error in order controller : ", error);
    res.status(400).json({ success: false, msg: error });
  }
};

//new
exports.postNewOrder = async (req, res) => {
  try {
    const response = await orderService.postOrder(req.body);
    res.status(200).json({ success: true, msg: response });
  } catch (error) {
    console.log("error in order controller : ", error);
    res.status(400).json({ success: false, msg: error });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const response = await orderService.getAllOrder();

    res.status(200).json({ success: true, msg: response });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ success: false, msg: null });
  }
};

exports.updateOrder = async (req, res) => {
  console.log(req.body);
  try {
    const response = await orderService.orderUpdate(req.body);
    console.log(response);
    res.status(200).json({ success: true, msg: response });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ success: false, msg: null });
  }
};

exports.deleteAdminOrder = async (req, res) => {
  console.log("hi");
  console.log(req.params);
  try {
    const response = await orderService.deleteOrder(req.params.orderId);
    console.log(response);
    res.status(200).json({ success: true, msg: response });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ success: false, msg: null });
  }
};
