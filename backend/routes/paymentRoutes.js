const express = require('express');
const router = express.Router();
const {
  createEasebuzzOrder, verifyEasebuzzPayment,
  createStripeIntent, stripeWebhook,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/easebuzz/create-order', protect, createEasebuzzOrder);
router.post('/easebuzz/verify', protect, verifyEasebuzzPayment);
router.post('/stripe/create-intent', protect, createStripeIntent);
router.post('/stripe/webhook', stripeWebhook);

module.exports = router;
