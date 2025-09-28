import {Component, inject, OnInit} from '@angular/core';
import {TechnologyService} from '../../../components/services/technology.service';
import {Technology} from '../../../models/technology.model.js';
import {TechnologyList} from '../../../components/technology-list/technology-list';
import {ListMode} from '../../../components/technology-list/list-mode.enum';
import {TechnologyRadar} from '../../../features/tech-radar/dumb_components/technology-radar/technology-radar';

@Component({
  selector: 'app-tech-radar-page',
  imports: [
    TechnologyList,
    TechnologyRadar
  ],
  template: `
    <div id="tech-radar">
      <app-technology-radar [technologies]="technologies" (technologySelected)="handleSelectedTechnology($event)" />
    </div>
    <app-technology-list [technologies]="technologies" [highlightedTechnology]="highlightedTechnologyId" [listMode]="ListMode.PUBLISHED_READONLY"></app-technology-list>
  `,
  styles: `
    #tech-radar {
      display: grid;
      grid-template-columns: 15% 60% 15%;
      grid-template-rows: 80vh auto;
    }
    app-technology-radar {
      grid-column: 2;
      grid-row: 1;
    }
  `
})
export class TechRadarPage implements OnInit{
  protected readonly ListMode = ListMode;

  private techItemService = inject(TechnologyService);

  technologies: Technology[] = [];
  highlightedTechnologyId?: String;

  ngOnInit() {
    this.techItemService.getPublishedTechnologies().subscribe({
      next: technologies => this.technologies = technologies,
      error: err => console.log(err)
    });
  }

  handleSelectedTechnology(technologyId: String) {
    this.highlightedTechnologyId = technologyId;
  }
}
