const router = require('express').Router();
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  phone: user.phone,
  token: genToken(user._id),
});

router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (await User.findOne({ email }))
    return res.status(400).json({ message: 'Email already registered' });
  const user = await User.create({ name, email, password, role: role || 'tenant' });
  res.status(201).json(userResponse(user));
}));

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid email or password' });
  res.json(userResponse(user));
}));

router.get('/me', protect, asyncHandler(async (req, res) => {
  res.json(req.user);
}));

module.exports = router;
