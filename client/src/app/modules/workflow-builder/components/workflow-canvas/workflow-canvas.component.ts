import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workflow-canvas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workflow-canvas.component.html',
  styleUrls: ['./workflow-canvas.component.scss']
})
export class WorkflowCanvasComponent {
  // This component is currently integrated into the workflow-builder component
  // This is a placeholder for future separation
}
