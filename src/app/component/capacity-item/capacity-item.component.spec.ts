import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacityRelatedItemComponent } from './capacity-item.component';

describe('CapacityRelatedItemComponent', () => {
  let component: CapacityRelatedItemComponent;
  let fixture: ComponentFixture<CapacityRelatedItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapacityRelatedItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacityRelatedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
