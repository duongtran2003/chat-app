import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavColComponent } from './nav-col.component';

describe('NavColComponent', () => {
  let component: NavColComponent;
  let fixture: ComponentFixture<NavColComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavColComponent]
    });
    fixture = TestBed.createComponent(NavColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
