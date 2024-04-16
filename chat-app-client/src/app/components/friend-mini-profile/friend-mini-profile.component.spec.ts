import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendMiniProfileComponent } from './friend-mini-profile.component';

describe('FriendMiniProfileComponent', () => {
  let component: FriendMiniProfileComponent;
  let fixture: ComponentFixture<FriendMiniProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendMiniProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FriendMiniProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
