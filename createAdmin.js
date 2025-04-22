require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const createAdminUser = async () => {
  try {
    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@mess.com' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Mess Manager',
      email: 'admin@mess.com',
      password: 'admin123',
      isAdmin: true
    });

    console.log('Admin user created:');
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Password: admin123`);
    console.log(`Admin: ${admin.isAdmin}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser(); 