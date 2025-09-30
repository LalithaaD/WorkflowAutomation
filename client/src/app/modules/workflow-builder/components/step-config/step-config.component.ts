import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step-config',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-config.component.html',
  styleUrls: ['./step-config.component.scss']
})
export class StepConfigComponent {
  // This component is currently integrated into the workflow-builder component
  // This is a placeholder for future separation
}
