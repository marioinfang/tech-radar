import {Component, inject, OnInit} from '@angular/core';
import {Technology} from '../../../models/technology.model';
import {TechItemService} from '../../../features/tech-item/services/tech-item.service';
import {MatDialog} from '@angular/material/dialog';
import {
  TechnologyDialogForm
} from '../../../features/tech-item/dumb_components/technology-dialog-form/technology-dialog-form';
import {TechnologyList} from '../../../features/tech-item/dumb_components/technology-list/technology-list';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-tech-radar-administration-page',
  standalone: true,
  imports: [
    TechnologyList,
    MatButton,
    MatIcon
  ],
  template: `
    <div>
      <button mat-raised-button (click)="handleCreateTechnology()">
        <mat-icon>add</mat-icon>
        new technology
      </button>
    </div>
    <app-technology-list [technologies]="technologies" (editTechnology)="handleEditTechnology($event)" (deleteTechnology)="handleDeleteTechnology($event)"></app-technology-list>
  `,
  styles: ``
})
export class TechRadarAdministrationPage implements OnInit{
  private techItemService = inject(TechItemService);
  readonly dialog = inject(MatDialog);

  technologies: Technology[] = [];

  ngOnInit(): void{
    this.loadTechnologies()
  }

  handleCreateTechnology() {
    const dialogRef = this.dialog.open(TechnologyDialogForm, {
      width: '400px',
      data: { technology: undefined }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(`Technology created ${result.technology}`);
        this.techItemService.addTechItem(result.technology).subscribe();
        this.loadTechnologies()
      }
    })
  }

  handleEditTechnology(techItem: Technology) {
    const dialogRef = this.dialog.open(TechnologyDialogForm, {
      width: '400px',
      data: { technology: techItem }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.techItemService.updateTechItem(result.technology).subscribe();
        this.loadTechnologies()
      }
    })
  }

  handleDeleteTechnology(techItem: Technology) {
    this.techItemService.deleteTechItem(techItem._id!);
    this.loadTechnologies();
  }

  // TODO: make this automatically without reload
  private loadTechnologies() {
    this.techItemService.getTechItems().subscribe({
      next: technologies => this.technologies = technologies,
      error: err => console.log(err)
    });
  }
}
