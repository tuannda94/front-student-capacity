import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnChatSupportComponent } from './btn-chat-support.component';

describe('BtnChatSupportComponent', () => {
  let component: BtnChatSupportComponent;
  let fixture: ComponentFixture<BtnChatSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtnChatSupportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnChatSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
