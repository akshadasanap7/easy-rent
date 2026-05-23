const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../config/cloudinary');

router.put('/profile', protect, upload.single('avatar'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, phone, role } = req.body;
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (role && ['tenant', 'host'].includes(role)) user.role = role;
  if (req.file) user.avatar = await uploadToCloudinary(req.file.buffer, 'easyrent/avatars');
  await user.save();
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone });
}));

router.post('/saved/:propertyId', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const pid = req.params.propertyId;
  const idx = user.savedProperties.findIndex((id) => id.toString() === pid);
  if (idx === -1) user.savedProperties.push(pid);
  else user.savedProperties.splice(idx, 1);
  await user.save();
  res.json({ saved: idx === -1, savedProperties: user.savedProperties });
}));

router.get('/saved', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'savedProperties',
    populate: { path: 'host', select: 'name avatar' },
  });
  res.json(user.savedProperties);
}));

module.exports = router;
