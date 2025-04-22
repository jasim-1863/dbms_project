const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookingsByDate,
  getTodayBookings,
  getUserBookings,
  getUserTodayBooking,
  getTodayMealCount
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

// Protected routes
router.post('/', protect, createBooking);
router.get('/user', protect, getUserBookings);
router.get('/user/today', protect, getUserTodayBooking);

// Admin routes
router.get('/date/:date', protect, admin, getBookingsByDate);
router.get('/today', protect, admin, getTodayBookings);
router.get('/today/count', protect, admin, getTodayMealCount);

module.exports = router; 