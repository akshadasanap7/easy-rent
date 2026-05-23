const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const { protect } = require('../middleware/auth');

router.post('/', protect, asyncHandler(async (req, res) => {
  const { propertyId, checkIn, checkOut, guests, message } = req.body;
  const property = await Property.findById(propertyId);
  if (!property) return res.status(404).json({ message: 'Property not found' });
  const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
  if (days < 1) return res.status(400).json({ message: 'Invalid dates' });
  const booking = await Booking.create({
    property: propertyId, tenant: req.user._id, host: property.host,
    checkIn, checkOut, totalPrice: days * property.price, guests, message,
  });
  res.status(201).json(booking);
}));

router.get('/my-bookings', protect, asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ tenant: req.user._id })
    .populate('property', 'title images location price')
    .populate('host', 'name avatar')
    .sort({ createdAt: -1 });
  res.json(bookings);
}));

router.get('/host-bookings', protect, asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ host: req.user._id })
    .populate('property', 'title images location')
    .populate('tenant', 'name avatar email phone')
    .sort({ createdAt: -1 });
  res.json(bookings);
}));

router.put('/:id/status', protect, asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  const isHost = booking.host.toString() === req.user._id.toString();
  const isTenant = booking.tenant.toString() === req.user._id.toString();
  if (!isHost && !isTenant) return res.status(403).json({ message: 'Not authorized' });
  booking.status = req.body.status;
  await booking.save();
  res.json(booking);
}));

module.exports = router;
