import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechRadarPage } from './tech-radar-page';

describe('TechRadarPage', () => {
  let component: TechRadarPage;
  let fixture: ComponentFixture<TechRadarPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechRadarPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechRadarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
