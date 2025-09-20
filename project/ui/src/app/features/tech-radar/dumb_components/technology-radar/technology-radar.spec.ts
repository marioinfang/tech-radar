import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyRadar } from './technology-radar';

describe('TechnologyRadar', () => {
  let component: TechnologyRadar;
  let fixture: ComponentFixture<TechnologyRadar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologyRadar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnologyRadar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
