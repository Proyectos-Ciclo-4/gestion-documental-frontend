import { TestBed } from '@angular/core/testing';

import { CtrCategoriesService } from './ctr-categories.service';

describe('CtrCategoriesService', () => {
  let service: CtrCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CtrCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
