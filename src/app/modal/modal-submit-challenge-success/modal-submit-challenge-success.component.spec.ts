import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSubmitChallengeSuccessComponent } from './modal-submit-challenge-success.component';

describe('ModalSubmitChallengeSuccessComponent', () => {
  let component: ModalSubmitChallengeSuccessComponent;
  let fixture: ComponentFixture<ModalSubmitChallengeSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSubmitChallengeSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSubmitChallengeSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
