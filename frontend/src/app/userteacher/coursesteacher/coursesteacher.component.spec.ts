import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesteacherComponent } from './coursesteacher.component';

describe('CoursesteacherComponent', () => {
  let component: CoursesteacherComponent;
  let fixture: ComponentFixture<CoursesteacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesteacherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoursesteacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
