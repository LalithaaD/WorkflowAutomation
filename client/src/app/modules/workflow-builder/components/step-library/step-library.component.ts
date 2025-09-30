import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step-library',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-library.component.html',
  styleUrls: ['./step-library.component.scss']
})
export class StepLibraryComponent {
  // This component is currently integrated into the workflow-builder component
  // This is a placeholder for future separation
}
