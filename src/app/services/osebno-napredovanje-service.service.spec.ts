import { TestBed } from '@angular/core/testing';

import { OsebnoNapredovanjeServiceService } from './osebno-napredovanje-service.service';

describe('OsebnoNapredovanjeServiceService', () => {
  let service: OsebnoNapredovanjeServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OsebnoNapredovanjeServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
