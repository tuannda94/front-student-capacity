import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacityPlayComponent } from './capacity-play.component';

describe('CapacityPlayComponent', () => {
  let component: CapacityPlayComponent;
  let fixture: ComponentFixture<CapacityPlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapacityPlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacityPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
