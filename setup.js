#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Workflow Automation Platform...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  const envContent = `PORT=3000
MONGODB_URI=mongodb://localhost:27017/workflow-automation
JWT_SECRET=your-super-secret-jwt-key-here-${Math.random().toString(36).substring(2)}
NODE_ENV=development

# Email configuration (for SendGrid or SMTP)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
CLIENT_URL=http://localhost:4200
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created with default values');
  console.log('⚠️  Please update the email configuration in .env file\n');
} else {
  console.log('✅ .env file already exists\n');
}

// Install backend dependencies
console.log('📦 Installing backend dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install backend dependencies:', error.message);
  process.exit(1);
}

// Install frontend dependencies
console.log('📦 Installing frontend dependencies...');
try {
  process.chdir('client');
  execSync('npm install', { stdio: 'inherit' });
  process.chdir('..');
  console.log('✅ Frontend dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies:', error.message);
  process.exit(1);
}

console.log('🎉 Setup completed successfully!\n');
console.log('📋 Next steps:');
console.log('1. Make sure MongoDB is running');
console.log('2. Update email configuration in .env file');
console.log('3. Run the application:');
console.log('   - Development mode: npm run dev:full');
console.log('   - Or separately: npm run dev (backend) and npm run client (frontend)');
console.log('4. Open http://localhost:4200 in your browser\n');
console.log('📖 See README.md for detailed documentation');
