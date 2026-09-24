const express = require('express');
const router = express.Router();
const { createOrder, verifyOrder, getRazorpayKey } = require("../controller/paymentController");

router.get('/razorpay-key', getRazorpayKey);
router.post('/create-order', createOrder);
router.post('/verify-order', verifyOrder);

module.exports = router;
