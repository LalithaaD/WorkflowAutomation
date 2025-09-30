import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExecutionLog } from './workflow.service';

export type { ExecutionLog };

export interface DashboardStats {
  totalWorkflows: number;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  recentExecutions: number;
  mostActiveWorkflows: Array<{
    workflowName: string;
    executionCount: number;
  }>;
  successRate: string;
}

export interface LogsResponse {
  logs: ExecutionLog[];
  totalPages: number;
  currentPage: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getLogs(page: number = 1, limit: number = 20, status?: string, workflowId?: string): Observable<LogsResponse> {
    let params = `page=${page}&limit=${limit}`;
    if (status) params += `&status=${status}`;
    if (workflowId) params += `&workflowId=${workflowId}`;
    
    return this.http.get<LogsResponse>(`${this.API_URL}/logs?${params}`);
  }

  getLog(id: string): Observable<ExecutionLog> {
    return this.http.get<ExecutionLog>(`${this.API_URL}/logs/${id}`);
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.API_URL}/logs/stats/dashboard`);
  }
}
