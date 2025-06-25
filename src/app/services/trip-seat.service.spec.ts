import { TestBed } from '@angular/core/testing';

import { TripSeatService } from './trip-seat.service';

describe('TripSeatService', () => {
  let service: TripSeatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripSeatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
