const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function fixUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/workflow-automation');
    console.log('Connected to MongoDB');

    // Delete existing demo user
    await User.deleteOne({ email: 'demo@example.com' });
    console.log('Deleted existing demo user');

    // Create new demo user with fresh password hash
    const demoUser = new User({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123' // This will be hashed by the pre-save hook
    });
    
    await demoUser.save();
    console.log('Created new demo user');

    // Test the password
    const isMatch = await demoUser.comparePassword('password123');
    console.log('Password test result:', isMatch);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

fixUser();
