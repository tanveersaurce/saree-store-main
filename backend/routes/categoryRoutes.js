const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { Category } = require('../models/index');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.type) {
    filter.type = req.query.type;
  }
  const categories = await Category.find(filter).sort('order name');
  res.json({ success: true, categories });
}));

router.post('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, category });
}));

router.put('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, category });
}));

router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Category deleted successfully' });
}));

module.exports = router;
