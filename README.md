# Workflow Automation Platform

A full-stack workflow automation web application similar to a mini-Zapier, built with Angular 16+ frontend, Node.js + Express backend, and MongoDB database.

## 🚀 Features

### Core Functionality
- **User Authentication**: JWT-based login/register system
- **Workflow Builder**: Drag-and-drop visual workflow creation
- **Workflow Execution**: Real-time workflow execution with step-by-step tracking
- **Execution Logs**: Detailed logs of workflow runs with step results
- **Dashboard**: Overview of workflows, execution stats, and recent activity

### Workflow Components
- **Triggers**: Form submissions, manual triggers, webhooks
- **Actions**: Send emails, save to database, call webhooks, delays
- **Conditions**: If/else branching based on data values
- **Real-time Updates**: WebSocket integration for live execution monitoring

### UI/UX Features
- **Responsive Design**: Works on desktop and tablet
- **Modern Interface**: Clean, intuitive design with Angular Material components
- **Drag & Drop**: Easy workflow building with Angular CDK
- **Real-time Feedback**: Live updates during workflow execution

## 🏗️ Architecture

### Backend (Node.js + Express)
```
server.js                 # Main server file
├── models/              # MongoDB schemas
│   ├── User.js         # User model with authentication
│   ├── Workflow.js     # Workflow model with steps
│   └── Log.js          # Execution log model
├── routes/             # API endpoints
│   ├── auth.js         # Authentication routes
│   ├── workflows.js    # Workflow CRUD and execution
│   └── logs.js         # Execution log routes
├── services/           # Business logic
│   └── WorkflowExecutor.js  # Workflow execution engine
└── middleware/         # Express middleware
    └── auth.js         # JWT authentication middleware
```

### Frontend (Angular 16+)
```
client/src/app/
├── components/         # Reusable components
│   ├── auth/          # Login/Register components
│   └── dashboard/     # Dashboard component
├── modules/           # Feature modules
│   ├── workflow-builder/  # Workflow creation and editing
│   └── execution-logs/    # Log viewing and details
├── services/          # API services
│   ├── auth.service.ts
│   ├── workflow.service.ts
│   └── log.service.ts
└── guards/            # Route guards
    └── auth.guard.ts
```

### Database (MongoDB)
- **Users**: Authentication and user management
- **Workflows**: Workflow definitions with steps and configuration
- **Logs**: Execution history with detailed step results

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud instance)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd WorkflowAutomation
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/workflow-automation
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development

# Email configuration (for SendGrid or SMTP)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
CLIENT_URL=http://localhost:4200
```

### 4. Database Setup
Make sure MongoDB is running:
```bash
# Start MongoDB (if running locally)
mongod

# Or use MongoDB Atlas cloud instance
# Update MONGODB_URI in .env file
```

### 5. Run the Application

#### Development Mode (Both Frontend and Backend)
```bash
# Run both frontend and backend concurrently
npm run dev:full
```

#### Run Separately
```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
npm run client
```

### 6. Access the Application
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000

## 📖 Usage Guide

### 1. User Registration/Login
- Navigate to the login page
- Register a new account or login with existing credentials
- JWT tokens are automatically managed

### 2. Creating Workflows
- Go to the Workflows section
- Click "Create New Workflow"
- Drag steps from the library to the canvas
- Configure each step's parameters
- Save your workflow

### 3. Available Step Types

#### Triggers
- **Form Submission**: Triggered when a form is submitted
- **Manual Trigger**: Triggered manually by user
- **Webhook**: Triggered by incoming HTTP requests

#### Actions
- **Send Email**: Send email notifications using SMTP
- **Save to Database**: Store data in MongoDB
- **Call Webhook**: Make HTTP requests to external APIs
- **Delay**: Wait for specified time

#### Conditions
- **If Condition**: Conditional branching based on data values

### 4. Workflow Execution
- Click "Run Workflow" on any saved workflow
- Monitor execution in real-time
- View detailed logs and step results

### 5. Monitoring & Logs
- Dashboard shows execution statistics
- Execution Logs section provides detailed run history
- Click on any log to see step-by-step execution details

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Workflows
- `GET /api/workflows` - Get all workflows
- `POST /api/workflows` - Create workflow
- `GET /api/workflows/:id` - Get specific workflow
- `PUT /api/workflows/:id` - Update workflow
- `DELETE /api/workflows/:id` - Delete workflow
- `POST /api/workflows/:id/run` - Execute workflow
- `GET /api/workflows/:id/logs` - Get workflow execution logs
- `GET /api/workflows/steps/available` - Get available step types

### Logs
- `GET /api/logs` - Get all execution logs
- `GET /api/logs/:id` - Get specific log details
- `GET /api/logs/stats/dashboard` - Get dashboard statistics

## 🎨 Sample Data

The application includes sample workflows and execution logs:

### Demo Workflows
1. **Welcome Email Automation** - Send welcome emails to new users
2. **Lead Qualification Workflow** - Route leads based on company size
3. **Order Processing Pipeline** - Process orders with confirmations
4. **Customer Feedback Processing** - Route feedback to appropriate teams
5. **Newsletter Signup Automation** - Welcome new subscribers

### Sample Data Location
- `sample-data/demo-workflows.json` - Pre-built workflow templates
- `sample-data/sample-execution-logs.json` - Example execution logs

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation and sanitization
- Protected API routes

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build the application: `npm run build`
3. Deploy to your preferred platform (Heroku, AWS, DigitalOcean, etc.)

### Frontend Deployment
1. Build the Angular app: `npm run client:build`
2. Deploy the `client/dist` folder to a static hosting service
3. Update API URLs in the frontend configuration

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
EMAIL_SERVICE=your-email-service
EMAIL_USER=your-email
EMAIL_PASS=your-email-password
CLIENT_URL=https://your-frontend-domain.com
```

## 🧪 Testing

### Backend Testing
```bash
# Run backend tests
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

## 📝 Workflow JSON Structure

```json
{
  "id": "workflowId",
  "userId": "userId",
  "name": "Workflow Name",
  "description": "Workflow description",
  "steps": [
    {
      "id": "step_1",
      "type": "trigger",
      "event": "form_submission",
      "config": {
        "formId": "contactForm"
      },
      "position": {
        "x": 100,
        "y": 100
      }
    },
    {
      "id": "step_2",
      "type": "action",
      "event": "send_email",
      "config": {
        "to": "{{form.email}}",
        "subject": "Thank you",
        "body": "Welcome message"
      },
      "position": {
        "x": 400,
        "y": 100
      }
    }
  ],
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the sample data and workflows

## 🔮 Future Enhancements

- [ ] More trigger types (scheduled, file upload, etc.)
- [ ] Advanced condition logic (AND/OR operators)
- [ ] Workflow templates and sharing
- [ ] Team collaboration features
- [ ] Advanced analytics and reporting
- [ ] Webhook testing tools
- [ ] Workflow versioning
- [ ] API rate limiting and quotas
- [ ] Multi-tenant support
- [ ] Mobile app

---

Built with ❤️ using Angular, Node.js, Express, and MongoDB
