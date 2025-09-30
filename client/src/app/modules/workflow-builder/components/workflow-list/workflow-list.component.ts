import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WorkflowService, Workflow } from '../../../../services/workflow.service';

@Component({
  selector: 'app-workflow-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workflow-list.component.html',
  styleUrls: ['./workflow-list.component.scss']
})
export class WorkflowListComponent implements OnInit {
  workflows: Workflow[] = [];
  isLoading = true;
  error = '';

  constructor(
    private workflowService: WorkflowService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadWorkflows();
  }

  loadWorkflows() {
    this.isLoading = true;
    this.workflowService.getWorkflows().subscribe({
      next: (workflows) => {
        this.workflows = workflows;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load workflows';
        this.isLoading = false;
      }
    });
  }

  createWorkflow() {
    this.router.navigate(['/workflows/new']);
  }

  editWorkflow(workflowId: string) {
    this.router.navigate(['/workflows', workflowId, 'edit']);
  }

  viewWorkflow(workflowId: string) {
    this.router.navigate(['/workflows', workflowId]);
  }

  deleteWorkflow(workflowId: string) {
    if (confirm('Are you sure you want to delete this workflow?')) {
      this.workflowService.deleteWorkflow(workflowId).subscribe({
        next: () => {
          this.loadWorkflows();
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to delete workflow';
        }
      });
    }
  }

  executeWorkflow(workflowId: string) {
    this.workflowService.executeWorkflow(workflowId).subscribe({
      next: (response) => {
        alert(`Workflow execution started. Log ID: ${response.logId}`);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to execute workflow';
      }
    });
  }
}
