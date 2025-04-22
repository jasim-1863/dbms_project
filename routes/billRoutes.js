const express = require('express');
const router = express.Router();
const {
  generateBill,
  getUserBills,
  getMyBills,
  getBillById,
  markBillAsPaid,
  getAllBills
} = require('../controllers/billController');
const { protect, admin } = require('../middleware/authMiddleware');

// Protected routes
router.get('/my-bills', protect, getMyBills);
router.get('/:id', protect, getBillById);

// Admin routes
router.post('/generate', protect, admin, generateBill);
router.get('/user/:userId', protect, admin, getUserBills);
router.put('/:id/pay', protect, admin, markBillAsPaid);
router.get('/', protect, admin, getAllBills);

module.exports = router; 