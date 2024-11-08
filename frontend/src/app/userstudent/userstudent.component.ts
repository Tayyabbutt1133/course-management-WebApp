// components/userstudent/student-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Teacher {
  _id: string;
  name: string;
  email: string;
}

interface Course {
  _id: string;
  name: string;
  description: string;
  duration: number;
  assignedTeacher: Teacher;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './userstudent.component.html'
})
export class StudentDashboardComponent implements OnInit {
  courses: Course[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.loading = true;
    this.http.get<Course[]>('http://localhost:5000/api/student/courses', {
      withCredentials: true
    }).subscribe({
      next: (data) => {
        console.log('Student courses:', data);
        this.courses = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.error = err.message || 'Failed to load courses';
        this.loading = false;
      }
    });
  }
}