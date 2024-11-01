import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserteacherComponent } from './userteacher.component';

describe('UserteacherComponent', () => {
  let component: UserteacherComponent;
  let fixture: ComponentFixture<UserteacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserteacherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserteacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
