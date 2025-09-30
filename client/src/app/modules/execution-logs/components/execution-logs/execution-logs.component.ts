import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LogService, ExecutionLog } from '../../../../services/log.service';

@Component({
  selector: 'app-execution-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './execution-logs.component.html',
  styleUrls: ['./execution-logs.component.scss']
})
export class ExecutionLogsComponent implements OnInit {
  logs: ExecutionLog[] = [];
  isLoading = true;
  error = '';
  currentPage = 1;
  totalPages = 1;
  total = 0;
  statusFilter = '';
  workflowFilter = '';

  constructor(
    private logService: LogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.isLoading = true;
    this.logService.getLogs(this.currentPage, 20, this.statusFilter, this.workflowFilter).subscribe({
      next: (response) => {
        this.logs = response.logs;
        this.totalPages = response.totalPages;
        this.total = response.total;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load logs';
        this.isLoading = false;
      }
    });
  }

  onStatusFilterChange() {
    this.currentPage = 1;
    this.loadLogs();
  }

  onWorkflowFilterChange() {
    this.currentPage = 1;
    this.loadLogs();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadLogs();
    }
  }

  viewLogDetails(logId: string) {
    this.router.navigate(['/logs', logId]);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'failed': return 'status-failed';
      case 'running': return 'status-running';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-unknown';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed': return '✅';
      case 'failed': return '❌';
      case 'running': return '⏳';
      case 'cancelled': return '⏹️';
      default: return '❓';
    }
  }
}
