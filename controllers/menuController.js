const Menu = require('../models/Menu');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find({}).sort({ day: 1 });
    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get menu for a specific day
// @route   GET /api/menu/:day
// @access  Public
const getMenuByDay = async (req, res) => {
  const { day } = req.params;
  
  try {
    const menu = await Menu.findOne({ day });
    
    if (menu) {
      res.json(menu);
    } else {
      res.status(404).json({ message: 'Menu not found for this day' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create or update a menu item
// @route   POST /api/menu
// @access  Private/Admin
const createOrUpdateMenu = async (req, res) => {
  const { day, breakfast, lunch, dinner } = req.body;

  try {
    // Check if menu for this day already exists
    let menu = await Menu.findOne({ day });

    if (menu) {
      // Update existing menu
      menu.breakfast = breakfast;
      menu.lunch = lunch;
      menu.dinner = dinner;
      menu.updatedBy = req.user._id;
      menu.updatedAt = Date.now();

      await menu.save();
      res.json(menu);
    } else {
      // Create new menu
      menu = await Menu.create({
        day,
        breakfast,
        lunch,
        dinner,
        updatedBy: req.user._id
      });

      res.status(201).json(menu);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:day
// @access  Private/Admin
const deleteMenu = async (req, res) => {
  const { day } = req.params;

  try {
    const menu = await Menu.findOne({ day });

    if (menu) {
      await menu.deleteOne();
      res.json({ message: 'Menu removed' });
    } else {
      res.status(404).json({ message: 'Menu not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get today's menu
// @route   GET /api/menu/today
// @access  Public
const getTodayMenu = async (req, res) => {
  try {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    
    const menu = await Menu.findOne({ day: today });
    
    if (menu) {
      res.json(menu);
    } else {
      res.status(404).json({ message: 'No menu found for today' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMenuItems,
  getMenuByDay,
  createOrUpdateMenu,
  deleteMenu,
  getTodayMenu
}; 