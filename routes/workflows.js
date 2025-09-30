const express = require('express');
const Workflow = require('../models/Workflow');
const Log = require('../models/Log');
const auth = require('../middleware/auth');
const WorkflowExecutor = require('../services/WorkflowExecutor');

const router = express.Router();

// Get all workflows for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const workflows = await Workflow.find({ userId: req.user._id })
      .sort({ updatedAt: -1 });
    
    res.json(workflows);
  } catch (error) {
    console.error('Get workflows error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific workflow
router.get('/:id', auth, async (req, res) => {
  try {
    const workflow = await Workflow.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    res.json(workflow);
  } catch (error) {
    console.error('Get workflow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new workflow
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, steps } = req.body;

    const workflow = new Workflow({
      userId: req.user._id,
      name,
      description,
      steps: steps || []
    });

    await workflow.save();
    res.status(201).json(workflow);
  } catch (error) {
    console.error('Create workflow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a workflow
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, steps, isActive } = req.body;

    const workflow = await Workflow.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name, description, steps, isActive },
      { new: true, runValidators: true }
    );

    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    res.json(workflow);
  } catch (error) {
    console.error('Update workflow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a workflow
router.delete('/:id', auth, async (req, res) => {
  try {
    const workflow = await Workflow.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    // Also delete associated logs
    await Log.deleteMany({ workflowId: req.params.id });

    res.json({ message: 'Workflow deleted successfully' });
  } catch (error) {
    console.error('Delete workflow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Execute a workflow
router.post('/:id/run', auth, async (req, res) => {
  try {
    const workflow = await Workflow.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    if (!workflow.isActive) {
      return res.status(400).json({ message: 'Workflow is not active' });
    }

    const triggerData = req.body.triggerData || {};

    // Create workflow executor instance
    const executor = new WorkflowExecutor(req.app.get('io'));
    
    // Execute workflow asynchronously
    const log = await executor.executeWorkflow(workflow, triggerData);

    // Update workflow execution count and last executed time
    await Workflow.findByIdAndUpdate(workflow._id, {
      $inc: { executionCount: 1 },
      lastExecuted: new Date()
    });

    res.json({
      message: 'Workflow execution started',
      logId: log._id,
      status: log.status
    });
  } catch (error) {
    console.error('Execute workflow error:', error);
    res.status(500).json({ message: 'Server error during execution' });
  }
});

// Get workflow execution logs
router.get('/:id/logs', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // Verify workflow belongs to user
    const workflow = await Workflow.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    const logs = await Log.find({ workflowId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Log.countDocuments({ workflowId: req.params.id });

    res.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get workflow logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available step types and events
router.get('/steps/available', auth, (req, res) => {
  const availableSteps = {
    triggers: [
      {
        id: 'form_submission',
        name: 'Form Submission',
        description: 'Triggered when a form is submitted',
        config: {
          formId: { type: 'string', required: true, label: 'Form ID' }
        }
      },
      {
        id: 'manual_trigger',
        name: 'Manual Trigger',
        description: 'Triggered manually by user',
        config: {}
      },
      {
        id: 'webhook',
        name: 'Webhook',
        description: 'Triggered by incoming webhook',
        config: {
          webhookUrl: { type: 'string', required: true, label: 'Webhook URL' }
        }
      }
    ],
    actions: [
      {
        id: 'send_email',
        name: 'Send Email',
        description: 'Send an email notification',
        config: {
          to: { type: 'string', required: true, label: 'To Email' },
          subject: { type: 'string', required: true, label: 'Subject' },
          body: { type: 'text', required: true, label: 'Email Body' }
        }
      },
      {
        id: 'save_to_database',
        name: 'Save to Database',
        description: 'Save data to database',
        config: {
          collection: { type: 'string', required: true, label: 'Collection Name' }
        }
      },
      {
        id: 'call_webhook',
        name: 'Call Webhook',
        description: 'Make HTTP request to external API',
        config: {
          url: { type: 'string', required: true, label: 'Webhook URL' },
          method: { type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE'], label: 'HTTP Method' },
          headers: { type: 'object', label: 'Headers' }
        }
      },
      {
        id: 'delay',
        name: 'Delay',
        description: 'Wait for specified time',
        config: {
          duration: { type: 'number', required: true, label: 'Duration (ms)' }
        }
      }
    ],
    conditions: [
      {
        id: 'if_condition',
        name: 'If Condition',
        description: 'Conditional branching based on data',
        config: {
          condition: { type: 'string', required: true, label: 'Field to Check' },
          operator: { type: 'select', options: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than'], label: 'Operator' },
          value: { type: 'string', required: true, label: 'Expected Value' }
        }
      }
    ]
  };

  res.json(availableSteps);
});

module.exports = router;
