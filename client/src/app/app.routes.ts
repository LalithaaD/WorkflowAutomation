import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [AuthGuard] },
  { path: 'workflows', loadChildren: () => import('./modules/workflow-builder/workflow-builder.module').then(m => m.WorkflowBuilderModule), canActivate: [AuthGuard] },
  { path: 'logs', loadChildren: () => import('./modules/execution-logs/execution-logs.module').then(m => m.ExecutionLogsModule), canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/dashboard' }
];
