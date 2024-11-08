// src/app/services/course.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  // For teachers
  getTeacherCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/teacher/courses`, { withCredentials: true });
  }

  getTeacherCourseById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/teacher/courses/${id}`, { withCredentials: true });
  }

  // For students
  getStudentCourses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/courses`, { withCredentials: true });
  }

  getStudentCourseById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/courses/${id}`, { withCredentials: true });
  }
}