import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinCapacityComponent } from './join-capacity.component';

describe('JoinCapacityComponent', () => {
  let component: JoinCapacityComponent;
  let fixture: ComponentFixture<JoinCapacityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinCapacityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
