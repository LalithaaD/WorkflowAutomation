const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  workflowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workflow',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['running', 'completed', 'failed', 'cancelled'],
    required: true
  },
  triggerData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  stepResults: [{
    stepId: String,
    stepType: String,
    stepEvent: String,
    status: {
      type: String,
      enum: ['pending', 'running', 'completed', 'failed', 'skipped']
    },
    startTime: Date,
    endTime: Date,
    duration: Number, // in milliseconds
    input: mongoose.Schema.Types.Mixed,
    output: mongoose.Schema.Types.Mixed,
    error: String
  }],
  totalDuration: Number, // in milliseconds
  error: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
logSchema.index({ workflowId: 1, createdAt: -1 });
logSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Log', logSchema);
