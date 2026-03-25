import { TestBed } from '@angular/core/testing';

import { OrdermasterService } from './ordermaster.service';

describe('OrdermasterService', () => {
  let service: OrdermasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdermasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
