import { TestBed } from '@angular/core/testing';

import { StrazaService } from './straza.service';

describe('StrazaService', () => {
  let service: StrazaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrazaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
