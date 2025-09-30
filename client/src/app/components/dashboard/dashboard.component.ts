import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LogService, DashboardStats } from '../../services/log.service';
import { WorkflowService } from '../../services/workflow.service';
import { Workflow } from '../../services/workflow.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  recentWorkflows: Workflow[] = [];
  isLoading = true;

  constructor(
    private logService: LogService,
    private workflowService: WorkflowService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    
    // Load dashboard stats
    this.logService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (err) => {
        console.error('Error loading dashboard stats:', err);
      }
    });

    // Load recent workflows
    this.workflowService.getWorkflows().subscribe({
      next: (workflows) => {
        this.recentWorkflows = workflows.slice(0, 5); // Show only 5 most recent
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading workflows:', err);
        this.isLoading = false;
      }
    });
  }

  goToWorkflows() {
    this.router.navigate(['/workflows']);
  }

  goToLogs() {
    this.router.navigate(['/logs']);
  }

  createWorkflow() {
    this.router.navigate(['/workflows/new']);
  }

  viewWorkflow(workflowId: string) {
    this.router.navigate(['/workflows', workflowId]);
  }

  get hasActiveWorkflows(): boolean {
    return !!(this.stats?.mostActiveWorkflows && this.stats.mostActiveWorkflows.length > 0);
  }
}
