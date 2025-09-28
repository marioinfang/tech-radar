import {Component, input, output} from '@angular/core';
import {
  MatExpansionModule
} from '@angular/material/expansion';
import {TechCategory} from '../../models/tech-category.enum';
import {Technology} from '../../models/technology.model.js';
import {TechnologyPanel} from '../../features/tech-radar/dumb_components/technology-panel/technology-panel';
import {TechnologyModifiablePanel} from '../../features/tech-item/dumb_components/technology-modifiable-panel/technology-modifiable-panel';
import {ListMode} from './list-mode.enum';

@Component({
  selector: 'app-technology-list',
  imports: [
    MatExpansionModule,
    TechnologyPanel,
    TechnologyModifiablePanel
  ],
  template:`
      <mat-accordion>
          @for (category of TechnologyCategories; track category) {
              <h2>{{ category }}</h2>

              @if (groupedTechnologies[category].length > 0) {
                  @for (technology of groupedTechnologies[category]; track technology.id) {
                      @if (listMode() === ListMode.MODIFIABLE) {
                          <app-technology-modifiable-panel [technology]="technology"
                                                           (editTechnology)="handleEditTechnology($event)"
                                                           (deleteTechnology)="handleDeleteTechnology($event)"></app-technology-modifiable-panel>
                      } @else if (listMode() === ListMode.PUBLISHED_READONLY) {
                          <app-technology-panel [technology]="technology"
                                                [highlight]="highlightedTechnology() === technology.id"></app-technology-panel>
                      }
                  }
              } @else {
                  <mat-expansion-panel disabled>
                      <mat-expansion-panel-header>
                          <mat-panel-title>No technologies registered</mat-panel-title>
                      </mat-expansion-panel-header>
                  </mat-expansion-panel>
              }

          }
      </mat-accordion>
  `,
  styles: `
    mat-accordion {
      width: 100%;
    }
  `,
  standalone: true,
})
export class TechnologyList {
  protected readonly TechnologyCategories = Object.values(TechCategory);
  protected readonly ListMode = ListMode;

  technologies = input.required<Technology[]>();
  listMode = input.required<ListMode>();
  highlightedTechnology = input<String>();
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
