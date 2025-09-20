import {Component, input, output} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {MatIcon} from '@angular/material/icon';
import {Technology} from '../../../../models/technology.model';

@Component({
  selector: 'app-technology-modifiable-panel',
  imports: [
    MatButton,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatIcon
  ],
  template: `
    <mat-expansion-panel hideToggle>
      <mat-expansion-panel-header>
        <mat-panel-title>{{technology().name}}</mat-panel-title>
        <mat-panel-description>{{technology().classification}}</mat-panel-description>
        @if (technology().published) {
          <mat-icon>visibility</mat-icon>
        }
        @else {
          <mat-icon>visibility_off</mat-icon>
        }
      </mat-expansion-panel-header>
      <p class="description-label">Technology description:</p>
      <p>{{technology().technologyDescription}}</p>
      @if (technology().classificationDescription) {
        <p class="description-label">Classification description:</p>
        <p>{{technology().classificationDescription}}</p>
      }
      <button mat-raised-button (click)="handleEditTechnology(technology())"><mat-icon>edit</mat-icon>Edit</button>
      <button mat-raised-button (click)="handleDeleteTechnology(technology())"><mat-icon>delete</mat-icon>Delete</button>
    </mat-expansion-panel>
  `,
  styles: `
    button {
      margin-right: 10px;
    }
    .description-label {
      font-weight: bold;
    }
  `,
  standalone: true,
})
export class TechnologyModifiablePanel {
  technology = input.required<Technology>();
  editTechnology = output<Technology>();
  deleteTechnology = output<Technology>();

  handleEditTechnology(technology: Technology) {
    this.editTechnology.emit(technology);
  }

  handleDeleteTechnology(technology: Technology) {
    this.deleteTechnology.emit(technology);
  }
}
