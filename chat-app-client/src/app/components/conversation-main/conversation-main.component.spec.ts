import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationMainComponent } from './conversation-main.component';

describe('ConversationMainComponent', () => {
  let component: ConversationMainComponent;
  let fixture: ComponentFixture<ConversationMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConversationMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
