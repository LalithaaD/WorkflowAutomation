import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService, ExecutionLog } from '../../../../services/log.service';

@Component({
  selector: 'app-log-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './log-details.component.html',
  styleUrls: ['./log-details.component.scss']
})
export class LogDetailsComponent implements OnInit {
  log: ExecutionLog | null = null;
  isLoading = true;
  error = '';

  constructor(
    private logService: LogService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const logId = this.route.snapshot.paramMap.get('id');
    if (logId) {
      this.loadLogDetails(logId);
    }
  }

  loadLogDetails(logId: string) {
    this.isLoading = true;
    this.logService.getLog(logId).subscribe({
      next: (log) => {
        this.log = log;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load log details';
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/logs']);
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

  getStepStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'step-completed';
      case 'failed': return 'step-failed';
      case 'running': return 'step-running';
      case 'pending': return 'step-pending';
      case 'skipped': return 'step-skipped';
      default: return 'step-unknown';
    }
  }

  getStepStatusIcon(status: string): string {
    switch (status) {
      case 'completed': return '✅';
      case 'failed': return '❌';
      case 'running': return '⏳';
      case 'pending': return '⏸️';
      case 'skipped': return '⏭️';
      default: return '❓';
    }
  }
}
