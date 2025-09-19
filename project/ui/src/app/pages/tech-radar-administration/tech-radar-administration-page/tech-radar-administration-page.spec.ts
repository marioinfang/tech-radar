import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechRadarAdministrationPage } from './tech-radar-administration-page';

describe('TechRadarAdministrationPage', () => {
  let component: TechRadarAdministrationPage;
  let fixture: ComponentFixture<TechRadarAdministrationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechRadarAdministrationPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechRadarAdministrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
