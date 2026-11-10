const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  productDetails: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentDetails: {
    paymentId: { type: String, default: "" },
    paymentMethod: { type: String, default: "Online / COD" },
    paymentStatus: { type: String, default: "Completed" }
  },
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  orderStatus: {
    type: String,
    default: "Confirmed"
  }
}, {
  timestamps: true,
});

const OrderModel = mongoose.model('order', orderSchema);
module.exports = OrderModel;