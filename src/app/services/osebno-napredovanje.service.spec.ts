import { TestBed } from '@angular/core/testing';

import { OsebnoNapredovanjeService } from './osebno-napredovanje.service';

describe('OsebnoNapredovanjeService', () => {
  let service: OsebnoNapredovanjeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OsebnoNapredovanjeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
