import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyPanel } from './technology-panel';

describe('TechnologyPanel', () => {
  let component: TechnologyPanel;
  let fixture: ComponentFixture<TechnologyPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologyPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnologyPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
