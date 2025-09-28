import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyModifiablePanel } from './technology-modifiable-panel';
import {Technology} from '../../../../models/technology.model';
import { TechCategory } from '../../../../models/tech-category.enum';
import {TechClassification} from '../../../../models/tech-classification.enum';
import { MatButtonModule } from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {By} from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';

// mock data
const mockTechnology: Technology = {
  id: '1',
  name: 'Technology',
  category: TechCategory.FRAMEWORKS,
  technologyDescription: 'TechDesc',
  classification: TechClassification.ADOPT,
  classificationDescription: 'ClassDesc',
  published: true
} as Technology;

describe('TechnologyModifiablePanel', () => {
  let component: TechnologyModifiablePanel;
  let fixture: ComponentFixture<TechnologyModifiablePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TechnologyModifiablePanel,
        MatIconModule,
        MatButtonModule,
        MatExpansionModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnologyModifiablePanel);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('technology', mockTechnology);
    fixture.detectChanges();
  });

  it('should create and display technology details', () => {
    // check if name and classification are displayed
    const headerElement = fixture.debugElement.query(By.css('mat-expansion-panel-header')).nativeElement;
    expect(headerElement.textContent).toContain(mockTechnology.name);
    expect(headerElement.textContent).toContain(mockTechnology.classification);

    // check if descriptions are displayed
    const panelContent = fixture.debugElement.query(By.css('mat-expansion-panel')).nativeElement;
    expect(panelContent.textContent).toContain(mockTechnology.technologyDescription);
    expect(panelContent.textContent).toContain(mockTechnology.classificationDescription);
  });

  it('should display the "visibility" icon when technology is published', () => {
    // check icon published
    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon.nativeElement.textContent.trim()).toBe('visibility');

    // check icon unpublished
    fixture.componentRef.setInput('technology', { ...mockTechnology, published: false });
    fixture.detectChanges();
    const newIcon = fixture.debugElement.query(By.css('mat-icon'));
    expect(newIcon.nativeElement.textContent.trim()).toBe('visibility_off');
  });

  it('should not show description title when it is null or empty', () => {
    // change classification description to null
    fixture.componentRef.setInput('technology', { ...mockTechnology, classificationDescription: null });
    fixture.detectChanges();

    const panelContent = fixture.debugElement.query(By.css('mat-expansion-panel')).nativeElement;

    // check if the title is visible
    expect(panelContent.textContent).not.toContain('Classification description:');
  });

  it('should emit output when the edit button is clicked', () => {
    // spy
    const editSpy = jasmine.createSpy('editTechnologySpy');
    component.editTechnology.subscribe(editSpy);

    // click edit button
    const editButton = fixture.debugElement.queryAll(By.css('button'))[0];
    editButton.triggerEventHandler('click', null);

    // check if the event has been emitted
    expect(editSpy).toHaveBeenCalledWith(mockTechnology);
  });

  it('should emit output when the delete button is clicked', () => {
    // spy
    const deleteSpy = jasmine.createSpy('deleteTechnologySpy');
    component.deleteTechnology.subscribe(deleteSpy);

    // click delete button
    const deleteButton = fixture.debugElement.queryAll(By.css('button'))[1];
    deleteButton.triggerEventHandler('click', null);

    // check if the event has been emitted
    expect(deleteSpy).toHaveBeenCalledWith(mockTechnology);
  });
});
