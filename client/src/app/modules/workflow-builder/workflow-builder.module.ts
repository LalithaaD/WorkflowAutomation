import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WorkflowListComponent } from './components/workflow-list/workflow-list.component';
import { WorkflowBuilderComponent } from './components/workflow-builder/workflow-builder.component';
import { StepLibraryComponent } from './components/step-library/step-library.component';
import { WorkflowCanvasComponent } from './components/workflow-canvas/workflow-canvas.component';
import { StepConfigComponent } from './components/step-config/step-config.component';

const routes: Routes = [
  { path: '', component: WorkflowListComponent },
  { path: 'new', component: WorkflowBuilderComponent },
  { path: ':id', component: WorkflowBuilderComponent },
  { path: ':id/edit', component: WorkflowBuilderComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    WorkflowListComponent,
    WorkflowBuilderComponent,
    StepLibraryComponent,
    WorkflowCanvasComponent,
    StepConfigComponent
  ]
})
export class WorkflowBuilderModule { }
