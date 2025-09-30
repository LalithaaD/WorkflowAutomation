const nodemailer = require('nodemailer');
const axios = require('axios');
const Log = require('../models/Log');

class WorkflowExecutor {
  constructor(io) {
    this.io = io;
    this.emailTransporter = this.createEmailTransporter();
  }

  createEmailTransporter() {
    return nodemailer.createTransporter({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async executeWorkflow(workflow, triggerData = {}) {
    const log = new Log({
      workflowId: workflow._id,
      userId: workflow.userId,
      status: 'running',
      triggerData,
      stepResults: []
    });

    try {
      await log.save();
      
      // Emit real-time update
      this.io.to(`workflow-${workflow._id}`).emit('workflow-started', {
        workflowId: workflow._id,
        logId: log._id,
        status: 'running'
      });

      const startTime = Date.now();
      let currentData = { ...triggerData };

      // Execute steps sequentially
      for (let i = 0; i < workflow.steps.length; i++) {
        const step = workflow.steps[i];
        const stepResult = await this.executeStep(step, currentData, log._id);
        
        log.stepResults.push(stepResult);
        
        // Emit step completion
        this.io.to(`workflow-${workflow._id}`).emit('step-completed', {
          workflowId: workflow._id,
          logId: log._id,
          stepId: step.id,
          result: stepResult
        });

        if (stepResult.status === 'failed') {
          log.status = 'failed';
          log.error = stepResult.error;
          break;
        }

        // Update current data with step output
        if (stepResult.output) {
          currentData = { ...currentData, ...stepResult.output };
        }
      }

      const endTime = Date.now();
      log.totalDuration = endTime - startTime;
      
      if (log.status === 'running') {
        log.status = 'completed';
      }

      await log.save();

      // Emit workflow completion
      this.io.to(`workflow-${workflow._id}`).emit('workflow-completed', {
        workflowId: workflow._id,
        logId: log._id,
        status: log.status,
        duration: log.totalDuration
      });

      return log;
    } catch (error) {
      console.error('Workflow execution error:', error);
      
      log.status = 'failed';
      log.error = error.message;
      await log.save();

      this.io.to(`workflow-${workflow._id}`).emit('workflow-failed', {
        workflowId: workflow._id,
        logId: log._id,
        error: error.message
      });

      throw error;
    }
  }

  async executeStep(step, inputData, logId) {
    const stepResult = {
      stepId: step.id,
      stepType: step.type,
      stepEvent: step.event,
      status: 'running',
      startTime: new Date(),
      input: inputData,
      output: null,
      error: null
    };

    try {
      let output = null;

      switch (step.type) {
        case 'trigger':
          output = await this.executeTrigger(step, inputData);
          break;
        case 'action':
          output = await this.executeAction(step, inputData);
          break;
        case 'condition':
          output = await this.executeCondition(step, inputData);
          break;
        default:
          throw new Error(`Unknown step type: ${step.type}`);
      }

      stepResult.status = 'completed';
      stepResult.output = output;
    } catch (error) {
      stepResult.status = 'failed';
      stepResult.error = error.message;
    }

    stepResult.endTime = new Date();
    stepResult.duration = stepResult.endTime - stepResult.startTime;

    return stepResult;
  }

  async executeTrigger(step, inputData) {
    switch (step.event) {
      case 'form_submission':
        return { formData: inputData };
      case 'manual_trigger':
        return { triggered: true, timestamp: new Date() };
      case 'webhook':
        return { webhookData: inputData };
      default:
        throw new Error(`Unknown trigger event: ${step.event}`);
    }
  }

  async executeAction(step, inputData) {
    switch (step.event) {
      case 'send_email':
        return await this.sendEmail(step.config, inputData);
      case 'save_to_database':
        return await this.saveToDatabase(step.config, inputData);
      case 'call_webhook':
        return await this.callWebhook(step.config, inputData);
      case 'delay':
        return await this.delay(step.config);
      default:
        throw new Error(`Unknown action event: ${step.event}`);
    }
  }

  async executeCondition(step, inputData) {
    const { condition, value, operator } = step.config;
    const inputValue = this.getNestedValue(inputData, condition);
    
    let result = false;
    switch (operator) {
      case 'equals':
        result = inputValue === value;
        break;
      case 'not_equals':
        result = inputValue !== value;
        break;
      case 'contains':
        result = String(inputValue).includes(String(value));
        break;
      case 'greater_than':
        result = Number(inputValue) > Number(value);
        break;
      case 'less_than':
        result = Number(inputValue) < Number(value);
        break;
      default:
        throw new Error(`Unknown operator: ${operator}`);
    }

    return { conditionResult: result, inputValue, expectedValue: value };
  }

  async sendEmail(config, inputData) {
    const { to, subject, body } = config;
    
    // Replace template variables
    const processedTo = this.replaceTemplateVariables(to, inputData);
    const processedSubject = this.replaceTemplateVariables(subject, inputData);
    const processedBody = this.replaceTemplateVariables(body, inputData);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: processedTo,
      subject: processedSubject,
      text: processedBody
    };

    await this.emailTransporter.sendMail(mailOptions);
    return { emailSent: true, to: processedTo };
  }

  async saveToDatabase(config, inputData) {
    // This would typically save to a specific collection
    // For now, we'll just return the data that would be saved
    return { saved: true, data: inputData };
  }

  async callWebhook(config, inputData) {
    const { url, method = 'POST', headers = {} } = config;
    
    const response = await axios({
      method,
      url,
      data: inputData,
      headers
    });

    return { webhookCalled: true, response: response.data };
  }

  async delay(config) {
    const { duration } = config; // duration in milliseconds
    await new Promise(resolve => setTimeout(resolve, duration));
    return { delayed: true, duration };
  }

  replaceTemplateVariables(template, data) {
    if (typeof template !== 'string') return template;
    
    return template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      const value = this.getNestedValue(data, key.trim());
      return value !== undefined ? String(value) : match;
    });
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }
}

module.exports = WorkflowExecutor;
