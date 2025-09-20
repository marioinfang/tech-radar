import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyModifiablePanel } from './technology-modifiable-panel';

describe('TechnologyModifiablePanel', () => {
  let component: TechnologyModifiablePanel;
  let fixture: ComponentFixture<TechnologyModifiablePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologyModifiablePanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnologyModifiablePanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
