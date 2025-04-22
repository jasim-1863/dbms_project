const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  breakfastCount: {
    type: Number,
    default: 0
  },
  lunchCount: {
    type: Number,
    default: 0
  },
  dinnerCount: {
    type: Number,
    default: 0
  },
  breakfastPrice: {
    type: Number,
    default: 50 // Default price in rupees
  },
  lunchPrice: {
    type: Number,
    default: 100
  },
  dinnerPrice: {
    type: Number,
    default: 100
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user can only have one bill per month/year
BillSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Bill', BillSchema); 