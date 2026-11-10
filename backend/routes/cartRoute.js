const express = require('express');
const router = express.Router();
const authToken = require('../middleware/authToken');
const {
  addToCartController,
  viewCartController,
  countCartController,
  updateCartQtyController,
  deleteCartItemController,
} = require('../controller/cartController');

router.post('/add-to-cart', authToken, addToCartController);
router.get('/view-cart-product', authToken, viewCartController);
router.get('/count-cart-product', authToken, countCartController);
router.post('/update-cart-qty', authToken, updateCartQtyController);
router.post('/delete-cart-product', authToken, deleteCartItemController);

module.exports = router;