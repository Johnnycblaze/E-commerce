const OrderModel = require('../model/orderModel');
const CartModel = require('../model/cartModel');

const paymentController = async (req, res) => {
  try {
    const currentUser = req.userId;
    const { cartItems, shippingAddress, totalAmount } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const formattedProductDetails = cartItems.map(item => ({
      productId: item.productId?._id || item.productId,
      quantity: item.quantity,
      price: item.productId?.sellingPrice || item.productId?.price || 0
    }));

    const newOrder = new OrderModel({
      userId: currentUser,
      productDetails: formattedProductDetails,
      totalAmount,
      shippingAddress,
      paymentDetails: { paymentMethod: "Online / COD", paymentStatus: "Completed" },
      orderStatus: "Confirmed"
    });

    const savedOrder = await newOrder.save();
    await CartModel.deleteMany({ userId: currentUser });

    return res.json({ success: true, message: "Order placed successfully!", data: savedOrder });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Error processing payment" });
  }
};

const getOrderController = async (req, res) => {
  try {
    const currentUser = req.userId;
    const orders = await OrderModel.find({ userId: currentUser })
      .populate("productDetails.productId")
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Error fetching order history" });
  }
};

module.exports = { paymentController, getOrderController };