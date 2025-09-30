import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkflowService, Workflow, WorkflowStep } from '../../../../services/workflow.service';

@Component({
  selector: 'app-workflow-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workflow-builder.component.html',
  styleUrls: ['./workflow-builder.component.scss']
})
export class WorkflowBuilderComponent implements OnInit {
  workflow: Workflow = {
    name: '',
    description: '',
    steps: []
  };
  
  isEditing = false;
  isLoading = false;
  isSaving = false;
  error = '';

  constructor(
    private workflowService: WorkflowService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const workflowId = this.route.snapshot.paramMap.get('id');
    if (workflowId) {
      this.isEditing = true;
      this.loadWorkflow(workflowId);
    }
  }

  loadWorkflow(id: string) {
    this.isLoading = true;
    this.workflowService.getWorkflow(id).subscribe({
      next: (workflow) => {
        this.workflow = workflow;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load workflow';
        this.isLoading = false;
      }
    });
  }

  saveWorkflow() {
    if (!this.workflow.name.trim()) {
      this.error = 'Workflow name is required';
      return;
    }

    this.isSaving = true;
    this.error = '';

    const saveOperation = this.isEditing
      ? this.workflowService.updateWorkflow(this.workflow._id!, this.workflow)
      : this.workflowService.createWorkflow(this.workflow);

    saveOperation.subscribe({
      next: (savedWorkflow) => {
        this.workflow = savedWorkflow;
        this.isEditing = true;
        this.isSaving = false;
        this.router.navigate(['/workflows', savedWorkflow._id, 'edit']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to save workflow';
        this.isSaving = false;
      }
    });
  }

  addStep(stepType: string, stepEvent: string) {
    const newStep: WorkflowStep = {
      id: this.generateStepId(),
      type: stepType as 'trigger' | 'action' | 'condition',
      event: stepEvent,
      config: {},
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100
      }
    };

    this.workflow.steps.push(newStep);
  }

  removeStep(stepId: string) {
    this.workflow.steps = this.workflow.steps.filter(step => step.id !== stepId);
  }

  executeWorkflow() {
    if (!this.workflow._id) {
      this.error = 'Please save the workflow before executing';
      return;
    }

    this.workflowService.executeWorkflow(this.workflow._id).subscribe({
      next: (response) => {
        alert(`Workflow execution started. Log ID: ${response.logId}`);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to execute workflow';
      }
    });
  }

  private generateStepId(): string {
    return 'step_' + Math.random().toString(36).substr(2, 9);
  }
}
