const asyncHandler = require('express-async-handler');
const crypto = require('node:crypto');

// ─── Easebuzz ─────────────────────────────────────────────────────────────────

// @desc    Create Easebuzz order (Initiate payment)
// @route   POST /api/payment/easebuzz/create-order
// @access  Private
const createEasebuzzOrder = asyncHandler(async (req, res) => {
  const { amount, orderId } = req.body;
  const user = req.user;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error('Invalid amount');
  }

  // ✅ FIX 1: No hardcoded fallback keys
  const key = process.env.EASEBUZZ_KEY;
  const salt = process.env.EASEBUZZ_SALT;
  const env = (process.env.EASEBUZZ_ENV || 'test').toLowerCase();
  const isProd = env === 'prod' || env === 'production';

  // ✅ FIX 2: Validate credentials exist
  if (!key || !salt) {
    res.status(500);
    throw new Error('Easebuzz credentials not configured. Please set EASEBUZZ_KEY and EASEBUZZ_SALT environment variables.');
  }

  const txnid = `TXN_${Date.now()}`;

  // ✅ FIX 3: Use correct FRONTEND_URL
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const surl = `${frontendUrl}/payment/success`;
  const furl = `${frontendUrl}/payment/failure`;

  const productinfo = 'Sarees';
  const firstname = (user.name ? user.name.split(' ')[0] : 'Customer').replace(/[^a-zA-Z0-9]/g, '') || 'Customer';
  const email = user.email || 'customer@example.com';

  // Ensure phone is exactly 10 digits
  let rawPhone = (user.phone || '').replace(/[^0-9]/g, '');
  if (rawPhone.length < 10) {
    rawPhone = '9999999999';
  } else {
    rawPhone = rawPhone.slice(-10);
  }
  const phone = rawPhone;

  const udf1 = orderId || '';
  const formattedAmount = Number(amount).toFixed(2);

  // ✅ FIX 4: Correct hash format
  // key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|salt
  const hashString = [
    key,
    txnid,
    formattedAmount,
    productinfo,
    firstname,
    email,
    udf1,
    '', // udf2
    '', // udf3
    '', // udf4
    '', // udf5
    '', // udf6
    '', // udf7
    '', // udf8
    '', // udf9
    '', // udf10
    salt,
  ].join('|');

  const hash = crypto.createHash('sha512').update(hashString).digest('hex');

  const payload = new URLSearchParams({
    key,
    txnid,
    amount: formattedAmount,
    productinfo,
    firstname,
    email,
    phone,
    surl,
    furl,
    hash,
    udf1,
  });

  // ✅ FIX 5: Removed test fallback — use correct URL based on env
  const url = isProd
    ? 'https://pay.easebuzz.in/payment/initiateLink'
    : 'https://testpay.easebuzz.in/payment/initiateLink';

  // console.log('--- EASEBUZZ REQUEST ---');
  // console.log('URL:', url);
  // console.log('Env:', env, '(isProd:', isProd, ')');
  // console.log('Key:', key);
  // console.log('Payload:', Object.fromEntries(payload));
  // console.log('Hash String:', hashString);
  // console.log('------------------------');

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: payload.toString(),
    });
  } catch (netError) {
    res.status(502);
    throw new Error(`Easebuzz Gateway Connection Error: ${netError.message}`);
  }

  const resData = await response.json();
  console.log('--- EASEBUZZ RESPONSE ---', resData);

  if (resData.status === 1) {
    return res.json({
      success: true,
      accessKey: resData.data,
      key,
      env: isProd ? 'prod' : 'test',
    });
  } else {
    const errorMsg = resData.error_desc || resData.data || 'Failed to initiate payment with Easebuzz';
    res.status(400);
    throw new Error(`Easebuzz Gateway Error: ${errorMsg}`);
  }
});

// @desc    Verify Easebuzz payment signature
// @route   POST /api/payment/easebuzz/verify
// @access  Private
const verifyEasebuzzPayment = asyncHandler(async (req, res) => {
  const {
    status,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    udf1,
    key,
    easepayid,
    hash,
  } = req.body;

  const salt = process.env.EASEBUZZ_SALT;

  // ✅ FIX 6: Validate salt exists
  if (!salt) {
    res.status(500);
    throw new Error('Easebuzz salt not configured');
  }

  // ✅ FIX 7: Correct reverse hash format for verification
  // salt|status|udf10|udf9|udf8|udf7|udf6|udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
  const checkHashString = [
    salt,
    status,
    '', // udf10
    '', // udf9
    '', // udf8
    '', // udf7
    '', // udf6
    '', // udf5
    '', // udf4
    '', // udf3
    '', // udf2
    udf1 || '',
    email,
    firstname,
    productinfo,
    amount,
    txnid,
    key,
  ].join('|');

  const calculatedHash = crypto.createHash('sha512').update(checkHashString).digest('hex');

  if (calculatedHash !== hash) {
    res.status(400);
    throw new Error('Payment verification failed: Invalid signature');
  }

  if (status !== 'success') {
    res.status(400);
    throw new Error('Payment status failed or pending');
  }

  res.json({
    success: true,
    message: 'Payment verified successfully',
    txnId: txnid,
    easepayId: easepayid,
  });
});

// ─── Stripe ───────────────────────────────────────────────────────────────────

// @desc    Create Stripe payment intent
// @route   POST /api/payment/stripe/create-intent
// @access  Private
const createStripeIntent = asyncHandler(async (req, res) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const { amount, currency = 'inr' } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    automatic_payment_methods: { enabled: true },
    metadata: { userId: req.user._id.toString() },
  });

  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });
});

// @desc    Stripe webhook
// @route   POST /api/payment/stripe/webhook
// @access  Public (raw body)
const stripeWebhook = asyncHandler(async (req, res) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    res.status(400);
    throw new Error(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('✅ Stripe payment succeeded:', event.data.object.id);
      break;
    case 'payment_intent.payment_failed':
      console.log('❌ Stripe payment failed:', event.data.object.id);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = {
  createEasebuzzOrder,
  verifyEasebuzzPayment,
  createStripeIntent,
  stripeWebhook,
};