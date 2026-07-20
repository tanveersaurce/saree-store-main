const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { Cart } = require('../models/index');

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, couponCode, loyaltyPointsUsed } = req.body;

  if (!items || items.length === 0) {
    res.status(400); throw new Error('No order items');
  }

  // Validate items, atomically reduce stock, and calculate prices
  const orderItems = [];
  let itemsPrice = 0;
  const reducedItems = [];

  try {
    for (const item of items) {
      // Atomically decrement stock if it is greater than or equal to quantity requested
      const product = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity, soldCount: item.quantity } },
        { new: true }
      );

      if (!product) {
        // Double-check if product exists at all to provide accurate error message
        const exists = await Product.findById(item.product);
        if (!exists) {
          res.status(404);
          throw new Error(`Product not found: ${item.product}`);
        } else {
          res.status(400);
          throw new Error(`Insufficient stock for: ${exists.name}`);
        }
      }

      // Track successful stock reductions for potential rollback
      reducedItems.push({ product: item.product, quantity: item.quantity });

      const price = product.discountPrice || product.price;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || '',
        price,
        quantity: item.quantity,
        color: item.color || '',
        sku: product.sku || '',
      });
      itemsPrice += price * item.quantity;
    }
  } catch (error) {
    // ROLLBACK: If any item in the order fails, restore stock for all previously reduced items
    for (const reduced of reducedItems) {
      await Product.findByIdAndUpdate(reduced.product, {
        $inc: { stock: reduced.quantity, soldCount: -reduced.quantity },
      });
    }
    throw error;
  }

  // Shipping (free above ₹999)
  const shippingPrice = itemsPrice >= 999 ? 0 : 99;

  // GST (5%)
  const taxPrice = Math.round(itemsPrice * 0.05);

  // Discount
  let discountAmount = 0;
  if (loyaltyPointsUsed) {
    discountAmount = Math.min(loyaltyPointsUsed, itemsPrice * 0.1);
  }

  const totalPrice = itemsPrice + shippingPrice + taxPrice - discountAmount;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    discountAmount,
    couponCode,
    loyaltyPointsUsed: loyaltyPointsUsed || 0,
    totalPrice,
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    loyaltyPointsEarned: Math.floor(totalPrice / 100),
  });

  // Clear cart
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

  const populatedOrder = await Order.findById(order._id).populate('user', 'name email phone');

  // Send order confirmation email for COD immediately
  if (paymentMethod === 'cod') {
    const { sendEmail } = require('../utils/sendEmail');
    try {
      await sendEmail({
        to: populatedOrder.user.email,
        subject: `Order #${populatedOrder.orderNumber} Confirmed! - Saaj`,
        template: 'orderConfirmation',
        data: {
          orderNumber: populatedOrder.orderNumber,
          totalPrice: populatedOrder.totalPrice,
          estimatedDelivery: new Date(populatedOrder.estimatedDelivery).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
          }),
        },
      });
      console.log(`📬 Order confirmation email sent to ${populatedOrder.user.email} for COD Order #${populatedOrder.orderNumber}`);
    } catch (err) {
      console.error('❌ Failed to send COD order confirmation email:', err.message);
    }
  }

  res.status(201).json({ success: true, message: 'Order placed successfully', order: populatedOrder });
});

// @desc    Get my orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const filter = { user: req.user._id };
  if (status) filter.status = status;

  const pageNum = Number.parseInt(page);
  const limitNum = Number.parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find(filter).sort('-createdAt').skip(skip).limit(limitNum).lean(),
    Order.countDocuments(filter),
  ]);

  res.json({
    success: true,
    orders,
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email phone');

  if (!order) { res.status(404); throw new Error('Order not found'); }

  // Allow user to see own orders or admin to see all
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized to view this order');
  }

  res.json({ success: true, order });
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.status = 'confirmed';
  order.paymentResult = req.body;

  const updatedOrder = await order.save();

  // Update user loyalty points
  const User = require('../models/User');
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { loyaltyPoints: updatedOrder.loyaltyPointsEarned, totalOrders: 1, totalSpent: updatedOrder.totalPrice },
  });

  // Send order confirmation email for online payments
  const { sendEmail } = require('../utils/sendEmail');
  try {
    const populatedUser = await User.findById(order.user);
    await sendEmail({
      to: populatedUser.email,
      subject: `Order #${updatedOrder.orderNumber} Confirmed! - Saaj`,
      template: 'orderConfirmation',
      data: {
        orderNumber: updatedOrder.orderNumber,
        totalPrice: updatedOrder.totalPrice,
        estimatedDelivery: new Date(updatedOrder.estimatedDelivery).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric',
        }),
      },
    });
    console.log(`📬 Order confirmation email sent to ${populatedUser.email} for Paid Order #${updatedOrder.orderNumber}`);
  } catch (err) {
    console.error('❌ Failed to send online order confirmation email:', err.message);
  }

  res.json({ success: true, message: 'Payment confirmed', order: updatedOrder });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }

  if (!['pending', 'confirmed'].includes(order.status)) {
    res.status(400); throw new Error('Order cannot be cancelled at this stage');
  }

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }

  order.status = 'cancelled';
  order.cancellationReason = req.body.reason || 'Cancelled by user';
  if (order.isPaid) {
    order.refundStatus = 'pending';
    order.refundAmount = order.totalPrice;
  }

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity, soldCount: -item.quantity },
    });
  }

  await order.save();
  res.json({ success: true, message: 'Order cancelled successfully', order });
});

// ─── Admin Controllers ────────────────────────────────────────────────────────

// @desc    Get all orders (admin)
// @route   GET /api/orders/admin/all
// @access  Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) filter.orderNumber = { $regex: search, $options: 'i' };

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find(filter).populate('user', 'name email phone').sort('-createdAt').skip(skip).limit(limitNum),
    Order.countDocuments(filter),
  ]);

  // Summary stats
  const stats = await Order.aggregate([
    { $group: {
      _id: null,
      totalRevenue: { $sum: '$totalPrice' },
      totalOrders: { $sum: 1 },
      avgOrderValue: { $avg: '$totalPrice' },
    }},
  ]);

  res.json({
    success: true,
    orders,
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    stats: stats[0] || {},
  });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber, trackingUrl, shippingCarrier, message } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }

  order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (trackingUrl) order.trackingUrl = trackingUrl;
  if (shippingCarrier) order.shippingCarrier = shippingCarrier;

  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  await order.save();
  res.json({ success: true, message: `Order status updated to ${status}`, order });
});

module.exports = {
  createOrder, getMyOrders, getOrder, updateOrderToPaid,
  cancelOrder, getAllOrders, updateOrderStatus,
};
