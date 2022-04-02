import { TestBed } from '@angular/core/testing';

import { PotniService } from './potni.service';

describe('PotniService', () => {
  let service: PotniService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PotniService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
