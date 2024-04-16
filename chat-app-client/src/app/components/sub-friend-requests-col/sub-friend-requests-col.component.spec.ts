import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubFriendRequestsColComponent } from './sub-friend-requests-col.component';

describe('SubFriendRequestsColComponent', () => {
  let component: SubFriendRequestsColComponent;
  let fixture: ComponentFixture<SubFriendRequestsColComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubFriendRequestsColComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubFriendRequestsColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
