const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['apartment', 'house', 'villa', 'studio', 'condo'], required: true },
    price: { type: Number, required: true },
    location: {
      address: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, default: '' },
      country: { type: String, default: 'India' },
    },
    images: [{ type: String }],
    amenities: [{ type: String }],
    bedrooms: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },
    area: { type: Number },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

propertySchema.index({ 'location.city': 'text', title: 'text', description: 'text' });

module.exports = mongoose.model('Property', propertySchema);
