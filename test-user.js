const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/workflow-automation');
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: 'demo@example.com' });
    if (user) {
      console.log('User found:', user.email);
      console.log('Password hash:', user.password);
      
      const isMatch = await user.comparePassword('password123');
      console.log('Password match:', isMatch);
    } else {
      console.log('User not found');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

testUser();
