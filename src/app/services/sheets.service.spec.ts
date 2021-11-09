import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { SheetsService } from './sheets.service';

describe('SheetsService', () => {
  let service: SheetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [SheetsService]
    });
    service = TestBed.inject(SheetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
