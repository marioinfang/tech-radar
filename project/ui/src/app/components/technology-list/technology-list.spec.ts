import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyList } from './technology-list';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Technology} from '../../models/technology.model';
import {TechCategory} from '../../models/tech-category.enum';
import {TechClassification} from '../../models/tech-classification.enum';
import {ListMode} from './list-mode.enum';
import {By} from '@angular/platform-browser';
import {TechnologyPanel} from '../../features/tech-radar/dumb_components/technology-panel/technology-panel';
import {
  TechnologyModifiablePanel
} from '../../features/tech-item/dumb_components/technology-modifiable-panel/technology-modifiable-panel';

// Mock technology panel
@Component({
  selector: 'app-technology-panel',
  standalone: true,
  template: `Mock-Panel: {{ technology.name }}`
})
class MockTechnologyPanel {
  @Input() technology!: Technology;
  @Input() highlight: boolean = false;
}

// Mock modifiable technology panel
@Component({
  selector: 'app-technology-modifiable-panel',
  standalone: true,
  template: `Mock-Modifiable: {{ technology.name }} <button (click)="editTechnology.emit(technology)">Edit</button>`
})
class MockTechnologyModifiablePanel {
  @Input() technology!: Technology;
  @Output() editTechnology = new EventEmitter<Technology>();
  @Output() deleteTechnology = new EventEmitter<Technology>();
}

const mockTechnologies: Technology[] = [
  { id: '1', name: 'Angular', category: TechCategory.TECHNIQUES, technologyDescription: 'TechDesc 1', published: false } as Technology,
  { id: '2', name: 'Spring', category: TechCategory.FRAMEWORKS, classification: TechClassification.ADOPT, technologyDescription: 'TechDesc 2', classificationDescription: 'ClassDesc 2', published: true } as Technology,
  { id: '3', name: 'React', category: TechCategory.FRAMEWORKS, classification: TechClassification.HOLD, technologyDescription: 'TechDesc 3', classificationDescription: 'ClassDesc 2', published: false } as Technology,
];

describe('TechnologyList', () => {
  let component: TechnologyList;
  let fixture: ComponentFixture<TechnologyList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologyList]
    }).overrideComponent(
      TechnologyList, {
        remove: { imports: [TechnologyPanel, TechnologyModifiablePanel] },
        add: { imports: [MockTechnologyPanel, MockTechnologyModifiablePanel] }
      })
    .compileComponents();

    fixture = TestBed.createComponent(TechnologyList);
    component = fixture.componentInstance;
  });

  it('should group technologies by category and render categories correctly', () => {
    // Inputs
    fixture.componentRef.setInput('technologies', mockTechnologies);
    fixture.componentRef.setInput('listMode', ListMode.PUBLISHED_READONLY);
    fixture.detectChanges();

    // chech if 4 category headers are rendered
    const categoryHeaders = fixture.debugElement.queryAll(By.css('h2'));
    expect(categoryHeaders.length).toBe(Object.values(TechCategory).length);

    // checks if the framework category has 2 two panels
    const frameworkSection = categoryHeaders.find(h => h.nativeElement.textContent.includes(TechCategory.FRAMEWORKS));
    expect(frameworkSection).toBeTruthy();

    // check total rendered panels
    const frameworkPanels = fixture.debugElement.queryAll(By.css('app-technology-panel'));
    expect(frameworkPanels.length).toBe(3);

    // check grouping of technologies
    const grouped = component.groupedTechnologies;
    expect(grouped[TechCategory.FRAMEWORKS].length).toBe(2);
    expect(grouped[TechCategory.TECHNIQUES].length).toBe(1);
    expect(grouped[TechCategory.TOOLS].length).toBe(0);
  });

  it('should render MODIFIABLE panels when listMode is MODIFIABLE', () => {
    fixture.componentRef.setInput('technologies', mockTechnologies);
    fixture.componentRef.setInput('listMode', ListMode.MODIFIABLE);
    fixture.detectChanges();

    // check if 3 modifiable panels are rendered
    expect(fixture.debugElement.queryAll(By.css('app-technology-modifiable-panel')).length).toBe(3);
    // check that zero none-modifiable panels are rendered
    expect(fixture.debugElement.queryAll(By.css('app-technology-panel')).length).toBe(0);
  });

  it('should render PUBLISHED_READONLY panels when listMode is PUBLISHED_READONLY', () => {
    fixture.componentRef.setInput('technologies', mockTechnologies);
    fixture.componentRef.setInput('listMode', ListMode.PUBLISHED_READONLY);
    fixture.detectChanges();

    // check if 3 none-modifiable panels are rendered
    expect(fixture.debugElement.queryAll(By.css('app-technology-panel')).length).toBe(3);
    // check that zero modifiable panels are rendered
    expect(fixture.debugElement.queryAll(By.css('app-technology-modifiable-panel')).length).toBe(0);
  });

  it('should re-emit the editTechnology output when a modifiable panel emits', () => {
    fixture.componentRef.setInput('technologies', [mockTechnologies[0]]);
    fixture.componentRef.setInput('listMode', ListMode.MODIFIABLE);
    fixture.detectChanges();

    // subscribe for edit output
    const editSpy = jasmine.createSpy('editTechnologySpy');
    component.editTechnology.subscribe(editSpy);

    // click edit button
    const modifiablePanel = fixture.debugElement.query(By.css('app-technology-modifiable-panel'));
    modifiablePanel.componentInstance.editTechnology.emit(mockTechnologies[0]);

    // check that event has been emitted
    expect(editSpy).toHaveBeenCalledWith(mockTechnologies[0]);
  });

  it('should re-emit the deleteTechnology output when a modifiable panel emits', () => {
    fixture.componentRef.setInput('technologies', [mockTechnologies[1]]);
    fixture.componentRef.setInput('listMode', ListMode.MODIFIABLE);
    fixture.detectChanges();

    // subscribe for delete output
    const deleteSpy = jasmine.createSpy('deleteTechnologySpy');
    component.deleteTechnology.subscribe(deleteSpy);

    // click delete button
    const modifiablePanel = fixture.debugElement.query(By.css('app-technology-modifiable-panel'));
    modifiablePanel.componentInstance.deleteTechnology.emit(mockTechnologies[1]);

    // check that event has been emitted
    expect(deleteSpy).toHaveBeenCalledWith(mockTechnologies[1]);
  });

  it('should show "No technologies registered" for empty categories', () => {
    fixture.componentRef.setInput('technologies', mockTechnologies);
    fixture.componentRef.setInput('listMode', ListMode.PUBLISHED_READONLY);
    fixture.detectChanges();

    // the tool category should be empty
    const emptyPanelTitle = fixture.debugElement.query(By.css('mat-expansion-panel[disabled] mat-panel-title'));

    // check if the message 'No technologies registered' is rendered
    expect(emptyPanelTitle).not.toBeNull();
    expect(emptyPanelTitle.nativeElement.textContent).toContain('No technologies registered');
  });
});
