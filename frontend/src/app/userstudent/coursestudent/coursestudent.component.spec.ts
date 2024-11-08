import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursestudentComponent } from './coursestudent.component';

describe('CoursestudentComponent', () => {
  let component: CoursestudentComponent;
  let fixture: ComponentFixture<CoursestudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursestudentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoursestudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
