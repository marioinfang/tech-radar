import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechRadarAdministrationPage } from './tech-radar-administration-page';
import {Component, input, output} from '@angular/core';
import {Technology} from '../../../models/technology.model';
import {ListMode} from '../../../components/technology-list/list-mode.enum';
import {TechnologyService} from '../../../components/services/technology.service';
import { of } from 'rxjs';
import {By} from '@angular/platform-browser';
import {TechnologyList} from '../../../components/technology-list/technology-list';
import {TechCategory} from '../../../models/tech-category.enum';

// mock list
@Component({
  selector: 'app-technology-list',
  standalone: true,
  template: ''
})
class MockTechnologyList {
  technologies = input.required<Technology[]>();
  listMode = input.required<ListMode>();
  editTechnology = output<Technology>();
  deleteTechnology = output<Technology>();
}

// mock data
const mockTechnologies: Technology[] = [
  { id: '1', name: 'Angular', published: true } as Technology,
  { id: '2', name: 'React', published: true } as Technology
];

const newTechnology: Technology = { id: '3', name: 'Vue', published: true } as Technology;
const updatedTechnology: Technology = { id: '2', name: 'React (Updated)', published: false, category: TechCategory.TOOLS } as Technology;

describe('TechRadarAdministrationPage', () => {
  let component: TechRadarAdministrationPage;
  let fixture: ComponentFixture<TechRadarAdministrationPage>;
  let technologyServiceSpy: jasmine.SpyObj<TechnologyService>;

  beforeEach(async () => {
    technologyServiceSpy = jasmine.createSpyObj('TechnologyService', [
      'getTechnologies',
      'createTechnology',
      'updateTechnology',
      'deleteTechnology'
    ]);

    technologyServiceSpy.getTechnologies.and.returnValue(of(mockTechnologies));

    await TestBed.configureTestingModule({
      imports: [TechRadarAdministrationPage],
      providers: [
        { provide: TechnologyService, useValue: technologyServiceSpy }
      ]
    }).overrideComponent(TechRadarAdministrationPage, {
      remove: { imports: [TechnologyList] },
      add: { imports: [MockTechnologyList] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechRadarAdministrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load technologies on start and emit to list', () => {
    expect(technologyServiceSpy.getTechnologies).toHaveBeenCalled();

    const listComponent = fixture.debugElement.query(By.directive(MockTechnologyList));

    expect(listComponent).not.toBeNull();

    expect(listComponent.componentInstance.technologies()).toEqual(mockTechnologies);
  });

  it('should create a new technology', () => {
    const dialogRefSpy = jasmine.createSpyObj({ afterClosed: of({ technology: newTechnology }) });
    spyOn(component.dialog, 'open').and.returnValue(dialogRefSpy);

    technologyServiceSpy.createTechnology.and.returnValue(of(newTechnology));

    component.handleCreateTechnology();

    expect(technologyServiceSpy.createTechnology).toHaveBeenCalledWith(newTechnology);
    expect(component.technologies).toContain(newTechnology);
  });

  it('should update a technology', () => {
    component.technologies = mockTechnologies;
    const dialogRefSpy = jasmine.createSpyObj({ afterClosed: of({ technology: updatedTechnology }) });
    spyOn(component.dialog, 'open').and.returnValue(dialogRefSpy);

    technologyServiceSpy.updateTechnology.and.returnValue(of(updatedTechnology));

    component.handleEditTechnology(mockTechnologies[1]);

    expect(technologyServiceSpy.updateTechnology).toHaveBeenCalled();
    expect(component.technologies.find(t => t.id === updatedTechnology.id)?.name)
      .toBe('React (Updated)');
  });

  it('should delete a technology when delete is confirmed', () => {
    component.technologies = [...mockTechnologies];

    technologyServiceSpy.deleteTechnology.and.returnValue(of(void 0));

    component.handleDeleteTechnology(mockTechnologies[0]);

    expect(technologyServiceSpy.deleteTechnology).toHaveBeenCalledWith('1');
    expect(component.technologies.find(t => t.id === '1')).toBeUndefined();
  });
});
