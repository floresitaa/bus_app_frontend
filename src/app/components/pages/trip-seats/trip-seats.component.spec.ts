import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripSeatsComponent } from './trip-seats.component';

describe('TripSeatsComponent', () => {
  let component: TripSeatsComponent;
  let fixture: ComponentFixture<TripSeatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripSeatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripSeatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
