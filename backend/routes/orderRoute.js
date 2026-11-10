const express = require('express');
const router = express.Router();
const authToken = require('../middleware/authToken');
const { paymentController, getOrderController } = require('../controller/orderController');

// Order & Checkout Routes
router.post('/checkout', authToken, paymentController);
router.post('/order/checkout', authToken, paymentController);

router.get('/order-history', authToken, getOrderController);
router.get('/order/order-history', authToken, getOrderController);

module.exports = router;