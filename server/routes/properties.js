const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const Property = require('../models/Property');
const { protect, hostOnly } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../config/cloudinary');

// GET host listings — must be before /:id to avoid conflict
router.get('/host/my-listings', protect, hostOnly, asyncHandler(async (req, res) => {
  const properties = await Property.find({ host: req.user._id }).sort({ createdAt: -1 });
  res.json(properties);
}));

// GET all with filters + pagination
router.get('/', asyncHandler(async (req, res) => {
  const { city, type, minPrice, maxPrice, bedrooms, search, page = 1, limit = 9 } = req.query;
  const query = { isAvailable: true };

  if (city) query['location.city'] = new RegExp(city, 'i');
  if (type) query.type = type;
  if (bedrooms) query.bedrooms = Number(bedrooms);
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (search) query.$or = [
    { title: new RegExp(search, 'i') },
    { description: new RegExp(search, 'i') },
    { 'location.city': new RegExp(search, 'i') },
  ];

  const total = await Property.countDocuments(query);
  const properties = await Property.find(query)
    .populate('host', 'name avatar')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ properties, total, pages: Math.ceil(total / limit), page: Number(page) });
}));

// GET single
router.get('/:id', asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate('host', 'name avatar email phone')
    .populate('reviews.user', 'name avatar');
  if (!property) return res.status(404).json({ message: 'Property not found' });
  res.json(property);
}));

// CREATE
router.post('/', protect, hostOnly, upload.array('images', 6), asyncHandler(async (req, res) => {
  const data = JSON.parse(req.body.data || '{}');
  const imageUrls = req.files?.length
    ? await Promise.all(req.files.map((f) => uploadToCloudinary(f.buffer, 'easyrent')))
    : data.images || [];
  const property = await Property.create({ ...data, images: imageUrls, host: req.user._id });
  res.status(201).json(property);
}));

// UPDATE
router.put('/:id', protect, hostOnly, asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ message: 'Property not found' });
  if (property.host.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });
  Object.assign(property, req.body);
  await property.save();
  res.json(property);
}));

// DELETE
router.delete('/:id', protect, hostOnly, asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ message: 'Property not found' });
  if (property.host.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not authorized' });
  await property.deleteOne();
  res.json({ message: 'Property deleted' });
}));

// ADD review
router.post('/:id/reviews', protect, asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const property = await Property.findById(req.params.id);
  if (!property) return res.status(404).json({ message: 'Property not found' });
  if (property.reviews.find((r) => r.user.toString() === req.user._id.toString()))
    return res.status(400).json({ message: 'Already reviewed' });
  property.reviews.push({ user: req.user._id, rating, comment });
  property.reviewCount = property.reviews.length;
  property.rating = property.reviews.reduce((a, r) => a + r.rating, 0) / property.reviews.length;
  await property.save();
  res.status(201).json({ message: 'Review added' });
}));

module.exports = router;
