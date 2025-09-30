# Quick Start Guide

Get the Workflow Automation Platform running in 5 minutes!

## 🚀 Quick Setup

### 1. Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud)

### 2. Clone and Setup
```bash
git clone <repository-url>
cd WorkflowAutomation
npm run setup
```

### 3. Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (update .env file)
```

### 4. Seed Database (Optional)
```bash
npm run seed
```

### 5. Run the Application
```bash
npm run dev:full
```

### 6. Access the App
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000

## 🔑 Demo Account
If you ran the seeder:
- **Email**: demo@example.com
- **Password**: password123

## 📋 What You Can Do

1. **Login/Register** - Create an account or use demo credentials
2. **View Dashboard** - See workflow statistics and recent activity
3. **Create Workflows** - Build automation workflows with drag-and-drop
4. **Run Workflows** - Execute workflows and see real-time results
5. **View Logs** - Monitor execution history and debug issues

## 🎯 Sample Workflows

The platform comes with 5 pre-built workflows:
1. **Welcome Email Automation** - Send welcome emails to new users
2. **Lead Qualification** - Route leads based on company size
3. **Order Processing** - Process orders with confirmations
4. **Customer Feedback** - Route feedback to appropriate teams
5. **Newsletter Signup** - Welcome new subscribers

## 🛠️ Available Steps

### Triggers
- Form Submission
- Manual Trigger
- Webhook

### Actions
- Send Email
- Save to Database
- Call Webhook
- Delay

### Conditions
- If Condition (with operators: equals, not_equals, contains, greater_than, less_than)

## 🔧 Configuration

Update `.env` file for email functionality:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 📖 Full Documentation

See [README.md](README.md) for complete documentation, API reference, and advanced features.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file

2. **Email Not Working**
   - Update email configuration in .env
   - Use app-specific password for Gmail

3. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing processes on ports 3000/4200

4. **Frontend Build Errors**
   - Run `cd client && npm install`
   - Check Node.js version (18+ required)

### Getting Help
- Check the full [README.md](README.md)
- Review sample data in `sample-data/` folder
- Create an issue in the repository

---

**Happy Automating! 🎉**
