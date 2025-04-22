const Booking = require('../models/Booking');

// @desc    Book meals for a day
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  const { date, breakfast, lunch, dinner } = req.body;
  const user = req.user._id;

  try {
    // Format date to remove time component
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    // Check if booking already exists for this user and date
    let booking = await Booking.findOne({ 
      user, 
      date: {
        $gte: bookingDate,
        $lt: new Date(bookingDate.getTime() + 24 * 60 * 60 * 1000)
      } 
    });

    if (booking) {
      // Update existing booking
      booking.breakfast = breakfast !== undefined ? breakfast : booking.breakfast;
      booking.lunch = lunch !== undefined ? lunch : booking.lunch;
      booking.dinner = dinner !== undefined ? dinner : booking.dinner;

      await booking.save();
      res.json(booking);
    } else {
      // Create new booking
      booking = await Booking.create({
        user,
        date: bookingDate,
        breakfast: breakfast !== undefined ? breakfast : true,
        lunch: lunch !== undefined ? lunch : true,
        dinner: dinner !== undefined ? dinner : true
      });

      res.status(201).json(booking);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get bookings for a specific date
// @route   GET /api/bookings/date/:date
// @access  Private/Admin
const getBookingsByDate = async (req, res) => {
  const { date } = req.params;
  
  try {
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);
    
    const bookings = await Booking.find({
      date: {
        $gte: bookingDate,
        $lt: new Date(bookingDate.getTime() + 24 * 60 * 60 * 1000)
      }
    }).populate('user', 'name email');
    
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get today's bookings
// @route   GET /api/bookings/today
// @access  Private/Admin
const getTodayBookings = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const bookings = await Booking.find({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    }).populate('user', 'name email');
    
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/user
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ date: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's booking for today
// @route   GET /api/bookings/user/today
// @access  Private
const getUserTodayBooking = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const booking = await Booking.findOne({
      user: req.user._id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ message: 'No booking found for today' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get total meals booked for today
// @route   GET /api/bookings/today/count
// @access  Private/Admin
const getTodayMealCount = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Aggregate to count bookings
    const result = await Booking.aggregate([
      {
        $match: {
          date: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: null,
          breakfastCount: { $sum: { $cond: ["$breakfast", 1, 0] } },
          lunchCount: { $sum: { $cond: ["$lunch", 1, 0] } },
          dinnerCount: { $sum: { $cond: ["$dinner", 1, 0] } },
          totalBookings: { $sum: 1 }
        }
      }
    ]);
    
    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.json({
        breakfastCount: 0,
        lunchCount: 0,
        dinnerCount: 0,
        totalBookings: 0
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBooking,
  getBookingsByDate,
  getTodayBookings,
  getUserBookings,
  getUserTodayBooking,
  getTodayMealCount
}; 