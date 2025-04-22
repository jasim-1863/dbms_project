const Bill = require('../models/Bill');
const Booking = require('../models/Booking');

// @desc    Generate bill for a user for a specific month/year
// @route   POST /api/bills/generate
// @access  Private/Admin
const generateBill = async (req, res) => {
  const { userId, month, year } = req.body;

  try {
    // Check if bill already exists
    let bill = await Bill.findOne({ user: userId, month, year });

    if (bill) {
      return res.status(400).json({ message: 'Bill already exists for this month' });
    }

    // Calculate start and end dates for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);  // Last day of the month

    // Get all bookings for this user in the specified month
    const bookings = await Booking.find({
      user: userId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });

    // Count meals
    let breakfastCount = 0;
    let lunchCount = 0;
    let dinnerCount = 0;

    bookings.forEach(booking => {
      if (booking.breakfast) breakfastCount++;
      if (booking.lunch) lunchCount++;
      if (booking.dinner) dinnerCount++;
    });

    // Set default prices
    const breakfastPrice = 50;  // in rupees
    const lunchPrice = 100;
    const dinnerPrice = 100;

    // Calculate total amount
    const totalAmount = (
      breakfastCount * breakfastPrice +
      lunchCount * lunchPrice +
      dinnerCount * dinnerPrice
    );

    // Create bill
    bill = await Bill.create({
      user: userId,
      month,
      year,
      breakfastCount,
      lunchCount,
      dinnerCount,
      breakfastPrice,
      lunchPrice,
      dinnerPrice,
      totalAmount
    });

    res.status(201).json(bill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all bills for a user
// @route   GET /api/bills/user/:userId
// @access  Private/Admin
const getUserBills = async (req, res) => {
  const { userId } = req.params;

  try {
    const bills = await Bill.find({ user: userId }).sort({ year: -1, month: -1 });
    res.json(bills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current user's bills
// @route   GET /api/bills/my-bills
// @access  Private
const getMyBills = async (req, res) => {
  try {
    const bills = await Bill.find({ user: req.user._id }).sort({ year: -1, month: -1 });
    res.json(bills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get bill by ID
// @route   GET /api/bills/:id
// @access  Private
const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate('user', 'name email');
    
    if (bill) {
      // Only allow admin or the bill owner to access
      if (req.user.isAdmin || bill.user._id.toString() === req.user._id.toString()) {
        res.json(bill);
      } else {
        res.status(401).json({ message: 'Not authorized to view this bill' });
      }
    } else {
      res.status(404).json({ message: 'Bill not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark bill as paid
// @route   PUT /api/bills/:id/pay
// @access  Private/Admin
const markBillAsPaid = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    
    if (bill) {
      bill.isPaid = true;
      
      const updatedBill = await bill.save();
      res.json(updatedBill);
    } else {
      res.status(404).json({ message: 'Bill not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all bills
// @route   GET /api/bills
// @access  Private/Admin
const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find({})
      .populate('user', 'name email')
      .sort({ year: -1, month: -1 });
    
    res.json(bills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  generateBill,
  getUserBills,
  getMyBills,
  getBillById,
  markBillAsPaid,
  getAllBills
}; 