import {Component, inject, OnInit} from '@angular/core';
import {Technology} from '../../../models/technology.model';
import {TechnologyService} from '../../../components/services/technology.service';
import {MatDialog} from '@angular/material/dialog';
import {
  TechnologyDialogForm
} from '../../../features/tech-item/dumb_components/technology-dialog-form/technology-dialog-form';
import {TechnologyList} from '../../../components/technology-list/technology-list';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {ListMode} from '../../../components/technology-list/list-mode.enum';
import {TechnologyMapper} from '../../../models/update-technology-dto.model';

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
    <app-technology-list [technologies]="technologies" [listMode]="ListMode.MODIFIABLE" (editTechnology)="handleEditTechnology($event)" (deleteTechnology)="handleDeleteTechnology($event)"></app-technology-list>
  `,
  styles: ``
})
export class TechRadarAdministrationPage implements OnInit{
  protected readonly ListMode = ListMode;

  private technologyService = inject(TechnologyService);
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
        this.technologyService.createTechnology(result.technology).subscribe();
        this.loadTechnologies()
      }
    })
  }

  handleEditTechnology(technology: Technology) {
    const dialogRef = this.dialog.open(TechnologyDialogForm, {
      width: '400px',
      data: { technology: technology }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.technologyService.updateTechnology(result.technology._id, TechnologyMapper.toUpdateDto(technology)).subscribe();
        this.loadTechnologies()
      }
    })
  }

  handleDeleteTechnology(technology: Technology) {
    this.technologyService.deleteTechnology(technology._id!).subscribe();
    this.loadTechnologies();
  }

  // TODO: make this automatically without reload
  private loadTechnologies() {
    this.technologyService.getTechnologies().subscribe({
      next: technologies => this.technologies = technologies,
      error: err => console.log(err)
    });
  }
}
