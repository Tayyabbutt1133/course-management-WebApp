import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserstudentComponent } from './userstudent.component';

describe('UserstudentComponent', () => {
  let component: UserstudentComponent;
  let fixture: ComponentFixture<UserstudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserstudentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserstudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
