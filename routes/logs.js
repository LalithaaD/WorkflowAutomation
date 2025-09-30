const express = require('express');
const Log = require('../models/Log');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all execution logs for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, workflowId } = req.query;
    
    const filter = { userId: req.user._id };
    if (status) filter.status = status;
    if (workflowId) filter.workflowId = workflowId;

    const logs = await Log.find(filter)
      .populate('workflowId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Log.countDocuments(filter);

    res.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific log
router.get('/:id', auth, async (req, res) => {
  try {
    const log = await Log.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('workflowId', 'name');

    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }

    res.json(log);
  } catch (error) {
    console.error('Get log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard statistics
router.get('/stats/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get total workflows
    const totalWorkflows = await require('../models/Workflow').countDocuments({ userId });
    
    // Get total executions
    const totalExecutions = await Log.countDocuments({ userId });
    
    // Get successful executions
    const successfulExecutions = await Log.countDocuments({ 
      userId, 
      status: 'completed' 
    });
    
    // Get failed executions
    const failedExecutions = await Log.countDocuments({ 
      userId, 
      status: 'failed' 
    });
    
    // Get recent executions (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentExecutions = await Log.countDocuments({ 
      userId, 
      createdAt: { $gte: sevenDaysAgo }
    });
    
    // Get most active workflows
    const mostActiveWorkflows = await Log.aggregate([
      { $match: { userId } },
      { $group: { _id: '$workflowId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'workflows',
          localField: '_id',
          foreignField: '_id',
          as: 'workflow'
        }
      },
      { $unwind: '$workflow' },
      { $project: { workflowName: '$workflow.name', executionCount: '$count' } }
    ]);

    res.json({
      totalWorkflows,
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      recentExecutions,
      mostActiveWorkflows,
      successRate: totalExecutions > 0 ? (successfulExecutions / totalExecutions * 100).toFixed(1) : 0
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
