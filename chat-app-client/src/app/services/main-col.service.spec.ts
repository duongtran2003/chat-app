import { TestBed } from '@angular/core/testing';

import { MainColService } from './main-col.service';

describe('MainColService', () => {
  let service: MainColService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainColService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
