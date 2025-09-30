import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ExecutionLogsComponent } from './components/execution-logs/execution-logs.component';
import { LogDetailsComponent } from './components/log-details/log-details.component';

const routes: Routes = [
  { path: '', component: ExecutionLogsComponent },
  { path: ':id', component: LogDetailsComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ExecutionLogsComponent,
    LogDetailsComponent
  ]
})
export class ExecutionLogsModule { }
