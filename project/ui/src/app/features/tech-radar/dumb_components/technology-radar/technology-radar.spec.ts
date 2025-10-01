import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { TechnologyRadar } from './technology-radar';
import {Technology} from '../../../../models/technology.model';
import {TechCategory} from '../../../../models/tech-category.enum';
import {TechClassification} from '../../../../models/tech-classification.enum';
import {By} from '@angular/platform-browser';

// mock data
const mockTechnologies: Technology[] = [
  { id: '1', name: 'Angular', category: TechCategory.FRAMEWORKS, classification: TechClassification.ADOPT } as Technology,
  { id: '2', name: 'React', category: TechCategory.TOOLS, classification: TechClassification.TRIAL } as Technology,
  { id: '3', name: 'Vue', category: TechCategory.FRAMEWORKS, classification: TechClassification.ADOPT } as Technology,
];

describe('TechnologyRadar', () => {
  let component: TechnologyRadar;
  let fixture: ComponentFixture<TechnologyRadar>;
  let createTechRadarSpy: jasmine.Spy;

  beforeEach(async () => {
    createTechRadarSpy = spyOn(TechnologyRadar.prototype, 'createTechRadar');

    await TestBed.configureTestingModule({
      imports: [TechnologyRadar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnologyRadar);
    component = fixture.componentInstance;
  });

  it('should call createTechRadar', fakeAsync(() => {
    expect(createTechRadarSpy).not.toHaveBeenCalled();
    fixture.componentRef.setInput('technologies', mockTechnologies);
    fixture.detectChanges();
    tick();

    expect(createTechRadarSpy).toHaveBeenCalledWith(mockTechnologies);
  }));

  it('should re crete radar on window resize', fakeAsync(() => {
    fixture.componentRef.setInput('technologies', mockTechnologies);
    fixture.detectChanges();
    tick();
    createTechRadarSpy.calls.reset();

    window.dispatchEvent(new Event('resize'));
    tick();

    expect(createTechRadarSpy).toHaveBeenCalled();
  }));

  it('should emit technologySelected event on blip click', () => {
    createTechRadarSpy.and.callThrough();
    fixture.componentRef.setInput('technologies', mockTechnologies);
    component.createTechRadar(mockTechnologies);
    fixture.detectChanges();

    const technologySelectedSpy = spyOn(component.technologySelected, 'emit');

    const blipDebugElement = fixture.debugElement.query(By.css('.blip'));
    expect(blipDebugElement).not.toBeNull();

    const blipElement = (fixture.nativeElement.querySelector('.blip') as SVGElement);
    if (blipElement) {
      blipElement.dispatchEvent(new MouseEvent('click'));
    }

    expect(technologySelectedSpy).toHaveBeenCalledWith('1');
  });
});
