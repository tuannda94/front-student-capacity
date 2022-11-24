import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeExamComponent } from './challenge-exam.component';

describe('ChallengeExamComponent', () => {
  let component: ChallengeExamComponent;
  let fixture: ComponentFixture<ChallengeExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallengeExamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
