#!/usr/bin/env node

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/User');
const Workflow = require('../models/Workflow');
const Log = require('../models/Log');

// Import sample data
const demoWorkflows = JSON.parse(fs.readFileSync(path.join(__dirname, '../sample-data/demo-workflows.json'), 'utf8'));
const sampleLogs = JSON.parse(fs.readFileSync(path.join(__dirname, '../sample-data/sample-execution-logs.json'), 'utf8'));

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/workflow-automation');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Workflow.deleteMany({});
    await Log.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create demo user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const demoUser = new User({
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword
    });
    await demoUser.save();
    console.log('👤 Created demo user (demo@example.com / password123)');

    // Create workflows
    const workflows = [];
    for (const workflowData of demoWorkflows) {
      const workflow = new Workflow({
        ...workflowData,
        userId: demoUser._id
      });
      await workflow.save();
      workflows.push(workflow);
    }
    console.log(`📋 Created ${workflows.length} demo workflows`);

    // Create sample execution logs
    const logs = [];
    for (const logData of sampleLogs) {
      const log = new Log({
        ...logData,
        userId: demoUser._id,
        workflowId: workflows[0]._id // Associate with first workflow
      });
      await log.save();
      logs.push(log);
    }
    console.log(`📊 Created ${logs.length} sample execution logs`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Demo Account:');
    console.log('   Email: demo@example.com');
    console.log('   Password: password123');
    console.log('\n🚀 You can now start the application and login with the demo account');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeder
seedDatabase();
