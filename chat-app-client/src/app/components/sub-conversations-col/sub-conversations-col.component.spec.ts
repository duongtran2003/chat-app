import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubConversationsColComponent } from './sub-conversations-col.component';

describe('SubConversationsColComponent', () => {
  let component: SubConversationsColComponent;
  let fixture: ComponentFixture<SubConversationsColComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubConversationsColComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubConversationsColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
