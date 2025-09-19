import {Component, input, output} from '@angular/core';
import {
  MatExpansionModule
} from '@angular/material/expansion';
import {TechCategory} from '../../../../models/tech-category.enum';
import {Technology} from '../../../../models/technology.model';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-technology-list',
  imports: [
    MatExpansionModule,
    MatButton,
    MatIcon
  ],
  template:`
    @for(category of TechnologyCategories; track category) {
      <h2>{{category}}</h2>
      <mat-accordion>
        @if (groupedTechnologies[category].length > 0) {
          @for (technology of groupedTechnologies[category]; track technology._id) {
            <!-- TODO: auslagern in komponente -->
            <mat-expansion-panel hideToggle>
              <mat-expansion-panel-header>
                <mat-panel-title>{{technology.name}}</mat-panel-title>
                <mat-panel-description>{{technology.classification}}</mat-panel-description>
                @if (technology.published) {
                  <mat-icon>visibility</mat-icon>
                }
                @else {
                  <mat-icon>visibility_off</mat-icon>
                }
              </mat-expansion-panel-header>
              <p class="description-label">Technology description:</p>
              <p>{{technology.technologyDescription}}</p>
              @if (technology.classificationDescription) {
                <p class="description-label">Classification description:</p>
                <p>{{technology.classificationDescription}}</p>
              }
              <button mat-raised-button (click)="handleEditTechnology(technology)"><mat-icon>edit</mat-icon>Edit</button>
              <button mat-raised-button (click)="handleDeleteTechnology(technology)"><mat-icon>delete</mat-icon>Delete</button>
            </mat-expansion-panel>
          }
        } @else {
          <mat-expansion-panel disabled>
            <mat-expansion-panel-header>
                <mat-panel-title>No technologies registered</mat-panel-title>
            </mat-expansion-panel-header>
          </mat-expansion-panel>
        }
      </mat-accordion>
    }
  `,
  styles: `
    mat-accordion {
      width: 100%;
    }
    button {
      margin-right: 10px;
    }
    .description-label {
      font-weight: bold;
    }
  `,
  standalone: true,
})
export class TechnologyList {
  readonly TechnologyCategories = Object.values(TechCategory);

  technologies = input.required<Technology[]>();
  editTechnology = output<Technology>();
  deleteTechnology = output<Technology>();

  get groupedTechnologies(): Record<string, Technology[]> {
    const groups: Record<string, Technology[]> = {};
    for (const category of this.TechnologyCategories) {
      groups[category] = this.technologies().filter(t => t.category === category);
    }
    return groups;
  }

  handleEditTechnology(technology: Technology) {
    this.editTechnology.emit(technology);
  }

  handleDeleteTechnology(technology: Technology) {
    this.deleteTechnology.emit(technology);
  }
}
