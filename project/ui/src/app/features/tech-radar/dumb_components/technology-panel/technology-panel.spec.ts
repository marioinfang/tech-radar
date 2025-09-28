import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import { TechnologyPanel } from './technology-panel';
import {Technology} from '../../../../models/technology.model';
import {TechCategory} from '../../../../models/tech-category.enum';
import {TechClassification} from '../../../../models/tech-classification.enum';
import {MatExpansionModule} from '@angular/material/expansion';
import {By} from '@angular/platform-browser';

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

describe('TechnologyPanel', () => {
  let component: TechnologyPanel;
  let fixture: ComponentFixture<TechnologyPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TechnologyPanel,
        MatExpansionModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnologyPanel);
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

  it('should not show description title when it is null or empty', () => {
    // set classification description to null
    fixture.componentRef.setInput('technology', { ...mockTechnology, classificationDescription: null });
    fixture.detectChanges();

    // check if the title is visible
    const panelContent = fixture.debugElement.query(By.css('mat-expansion-panel')).nativeElement;
    expect(panelContent.textContent).not.toContain('Classification description:');
  });
});
