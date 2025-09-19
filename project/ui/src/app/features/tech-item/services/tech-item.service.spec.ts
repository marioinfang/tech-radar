import { TestBed } from '@angular/core/testing';

import { TechItemService } from './tech-item.service';

describe('TechItemService', () => {
  let service: TechItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
