import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubFriendsColComponent } from './sub-friends-col.component';

describe('SubFriendsColComponent', () => {
  let component: SubFriendsColComponent;
  let fixture: ComponentFixture<SubFriendsColComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubFriendsColComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubFriendsColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
