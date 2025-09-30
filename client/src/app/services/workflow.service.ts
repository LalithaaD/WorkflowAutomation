import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action' | 'condition';
  event: string;
  config: any;
  position?: {
    x: number;
    y: number;
  };
  connections?: string[];
}

export interface Workflow {
  _id?: string;
  userId?: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
  isActive?: boolean;
  lastExecuted?: Date;
  executionCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExecutionLog {
  _id?: string;
  workflowId: string;
  userId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  triggerData?: any;
  stepResults?: StepResult[];
  totalDuration?: number;
  error?: string;
  createdAt?: Date;
}

export interface StepResult {
  stepId: string;
  stepType: string;
  stepEvent: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  input?: any;
  output?: any;
  error?: string;
}

export interface AvailableSteps {
  triggers: StepDefinition[];
  actions: StepDefinition[];
  conditions: StepDefinition[];
}

export interface StepDefinition {
  id: string;
  name: string;
  description: string;
  config: { [key: string]: any };
}

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getWorkflows(): Observable<Workflow[]> {
    return this.http.get<Workflow[]>(`${this.API_URL}/workflows`);
  }

  getWorkflow(id: string): Observable<Workflow> {
    return this.http.get<Workflow>(`${this.API_URL}/workflows/${id}`);
  }

  createWorkflow(workflow: Partial<Workflow>): Observable<Workflow> {
    return this.http.post<Workflow>(`${this.API_URL}/workflows`, workflow);
  }

  updateWorkflow(id: string, workflow: Partial<Workflow>): Observable<Workflow> {
    return this.http.put<Workflow>(`${this.API_URL}/workflows/${id}`, workflow);
  }

  deleteWorkflow(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_URL}/workflows/${id}`);
  }

  executeWorkflow(id: string, triggerData?: any): Observable<{ message: string; logId: string; status: string }> {
    return this.http.post<{ message: string; logId: string; status: string }>(
      `${this.API_URL}/workflows/${id}/run`,
      { triggerData }
    );
  }

  getWorkflowLogs(id: string, page: number = 1, limit: number = 10): Observable<{
    logs: ExecutionLog[];
    totalPages: number;
    currentPage: number;
    total: number;
  }> {
    return this.http.get<{
      logs: ExecutionLog[];
      totalPages: number;
      currentPage: number;
      total: number;
    }>(`${this.API_URL}/workflows/${id}/logs?page=${page}&limit=${limit}`);
  }

  getAvailableSteps(): Observable<AvailableSteps> {
    return this.http.get<AvailableSteps>(`${this.API_URL}/workflows/steps/available`);
  }
}
