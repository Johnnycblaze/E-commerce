const CartModel = require("../model/cartModel");

const addToCartController = async (req, res) => {
  try {
    const { productId } = req.body;
    const currentUser = req.userId;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const isProductAvailable = await CartModel.findOne({ productId, userId: currentUser });

    if (isProductAvailable) {
      isProductAvailable.quantity += 1;
      const updatedCart = await isProductAvailable.save();
      return res.json({ success: true, message: "Product quantity increased in cart!", data: updatedCart });
    }

    const newAddToCart = new CartModel({ productId, quantity: 1, userId: currentUser });
    const saveCart = await newAddToCart.save();

    return res.status(200).json({ success: true, message: "Product added to cart successfully!", data: saveCart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Error adding product to cart" });
  }
};

const viewCartController = async (req, res) => {
  try {
    const currentUser = req.userId;
    const cartItems = await CartModel.find({ userId: currentUser }).populate("productId");
    return res.json({ success: true, data: cartItems });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Error fetching cart items" });
  }
};

const countCartController = async (req, res) => {
  try {
    const currentUser = req.userId;
    const cartItems = await CartModel.find({ userId: currentUser });
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    return res.json({ success: true, data: { count: totalCount } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Error counting cart items" });
  }
};

const updateCartQtyController = async (req, res) => {
  try {
    const currentUser = req.userId;
    const { _id, quantity } = req.body;
    const updateCart = await CartModel.updateOne({ _id, userId: currentUser }, { quantity });
    return res.json({ success: true, message: "Cart updated successfully", data: updateCart });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Error updating quantity" });
  }
};

const deleteCartItemController = async (req, res) => {
  try {
    const currentUser = req.userId;
    const { _id } = req.body;
    const deleteCartItem = await CartModel.deleteOne({ _id, userId: currentUser });
    return res.json({ success: true, message: "Item removed from cart", data: deleteCartItem });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Error deleting item" });
  }
};

module.exports = {
  addToCartController,
  viewCartController,
  countCartController,
  updateCartQtyController,
  deleteCartItemController,
};