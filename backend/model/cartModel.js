const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product', // Must match your Product model registration name
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  userId: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

const CartModel = mongoose.model('cart', cartSchema);
module.exports = CartModel;