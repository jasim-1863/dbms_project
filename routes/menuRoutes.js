const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuByDay,
  createOrUpdateMenu,
  deleteMenu,
  getTodayMenu
} = require('../controllers/menuController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getMenuItems);
router.get('/today', getTodayMenu);
router.get('/:day', getMenuByDay);

// Admin routes
router.post('/', protect, admin, createOrUpdateMenu);
router.delete('/:day', protect, admin, deleteMenu);

module.exports = router; 