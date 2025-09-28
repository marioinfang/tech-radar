import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { TechRadarPage } from './tech-radar-page';
import {Component, input, output} from '@angular/core';
import {Technology} from '../../../models/technology.model';
import {ListMode} from '../../../components/technology-list/list-mode.enum';
import {TechnologyService} from '../../../components/services/technology.service';
import {Subject} from 'rxjs';
import { By } from '@angular/platform-browser';
import {TechnologyRadar} from '../../../features/tech-radar/dumb_components/technology-radar/technology-radar';
import {TechnologyList} from '../../../components/technology-list/technology-list';

// mock technology list
@Component({
  selector: 'app-technology-list',
  standalone: true,
  template: ''
})
class MockTechnologyList {
  technologies = input.required<Technology[]>();
  highlightedTechnology = input<String | undefined>();
  listMode = input.required<ListMode>();
}

// mock radar
@Component({
  selector: 'app-technology-radar',
  standalone: true,
  template: ''
})
class MockTechnologyRadar {
  technologies = input.required<Technology[]>();
  technologySelected = output<String>();
}

// mock data
const mockTechnologies: Technology[] = [
  { id: '1', name: 'Angular', published: true } as Technology,
  { id: '2', name: 'React', published: true } as Technology
];

describe('TechRadarPage', () => {
  let component: TechRadarPage;
  let fixture: ComponentFixture<TechRadarPage>;
  let technologyServiceSpy: jasmine.SpyObj<TechnologyService>;
  let technologiesSubject: Subject<Technology[]>;

  beforeEach(async () => {
    technologiesSubject = new Subject<Technology[]>();
    technologyServiceSpy = jasmine.createSpyObj('TechnologyService', ['getPublishedTechnologies']);
    technologyServiceSpy.getPublishedTechnologies.and.returnValue(technologiesSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [
        TechRadarPage
      ],
      providers: [
        { provide: TechnologyService, useValue: technologyServiceSpy }
      ]
    }).overrideComponent(
      TechRadarPage, {
      remove: { imports: [TechnologyRadar, TechnologyList]},
      add: {imports: [MockTechnologyRadar, MockTechnologyList]}
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechRadarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call getPublishedTechnologies on start', () => {
    component.ngOnInit();

    expect(technologyServiceSpy.getPublishedTechnologies).toHaveBeenCalled();
    technologiesSubject.next(mockTechnologies);
    fixture.detectChanges();

    // check if loaded technologies are correctly set
    expect(component.technologies).toEqual(mockTechnologies);
    expect(component.technologies.length).toBe(2);
  });

  it('should update highlightedTechnologyId', () => {
    const mockId = '2';
    component.handleSelectedTechnology(mockId);
    expect(component.highlightedTechnologyId).toBe(mockId);
  });

  it('should pass the technologies and highlightId to components', fakeAsync(() => {
    component.ngOnInit();
    technologiesSubject.next(mockTechnologies);
    fixture.detectChanges();

    const mockIdFromRadar = '1';
    component.handleSelectedTechnology(mockIdFromRadar);
    fixture.detectChanges();

    // check if technologies get passed to radar
    const radarDebug = fixture.debugElement.query(By.directive(MockTechnologyRadar));
    expect(radarDebug).not.toBeNull();
    const radarInstance = radarDebug.componentInstance;
    expect(radarInstance.technologies()).toEqual(mockTechnologies);


    // check if technologies and highlightId get passed to list
    const listDebug = fixture.debugElement.query(By.directive(MockTechnologyList));
    expect(listDebug).not.toBeNull();
    const listInstance = listDebug.componentInstance;
    expect(listInstance.technologies()).toEqual(mockTechnologies);
    expect(listInstance.highlightedTechnology()).toBe(mockIdFromRadar);
    expect(listInstance.listMode()).toBe(ListMode.PUBLISHED_READONLY);
  }));

  it('should react to the technologySelected event', fakeAsync(() => {
    component.ngOnInit();
    technologiesSubject.next(mockTechnologies);
    fixture.detectChanges();

    const radarDebug = fixture.debugElement.query(By.directive(MockTechnologyRadar));
    const mockIdFromRadar = '2';

    // trigger highlight event
    radarDebug.triggerEventHandler('technologySelected', mockIdFromRadar);
    fixture.detectChanges();

    // check if the highlightId was updated
    expect(component.highlightedTechnologyId).toBe(mockIdFromRadar);

    // check if hihglightId was passed to list
    const listDebug = fixture.debugElement.query(By.directive(MockTechnologyList));
    const listInstance = listDebug.componentInstance;
    expect(listInstance.highlightedTechnology()).toBe(mockIdFromRadar);
  }));
});
