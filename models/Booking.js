const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  breakfast: {
    type: Boolean,
    default: true
  },
  lunch: {
    type: Boolean,
    default: true
  },
  dinner: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user can only have one booking per date
BookingSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Booking', BookingSchema); 