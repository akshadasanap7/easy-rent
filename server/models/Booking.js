const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    guests: { type: Number, default: 1 },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
