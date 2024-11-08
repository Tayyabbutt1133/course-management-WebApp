// login.component.ts
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Emitters } from '../emitters/emitter';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.isLoading = true;

    this.http.post("http://localhost:5000/api/login", this.form.value, {
      withCredentials: true
    }).subscribe({
      next: async (response: any) => {
        console.log('Login response:', response); // Debug log
        Emitters.authEmitter.emit(true);

        // Show success message
        await Swal.fire({
          title: 'Success',
          text: `Welcome ${response.user.name}!`,
          icon: 'success',
          timer: 1500
        });

        // Handle routing based on role and email
        try {
          if (response.user.role === 'admin' && response.user.email === 'admin@gmail.com') {
            await this.router.navigate(['/admin/teachers']);
          } else if (response.user.role === 'teacher') {
            // Fetch teacher's courses and navigate to teacher dashboard
            this.http.get('http://localhost:5000/api/teacher/courses', {
              withCredentials: true
            }).subscribe({
              next: (courses: any) => {
                console.log('Teacher courses:', courses);
                this.router.navigate(['/teacher/dashboard']);
              },
              error: (err) => {
                console.error('Error fetching teacher courses:', err);
                Swal.fire('Error', 'Failed to load courses', 'error');
              }
            });
          } else if (response.user.role === 'student') {
            // Fetch student's courses and navigate to student dashboard
            this.http.get('http://localhost:5000/api/student/courses', {
              withCredentials: true
            }).subscribe({
              next: (courses: any) => {
                console.log('Student courses:', courses);
                this.router.navigate(['/student/dashboard']);
              },
              error: (err) => {
                console.error('Error fetching student courses:', err);
                Swal.fire('Error', 'Failed to load courses', 'error');
              }
            });
          }
        } catch (error) {
          console.error('Navigation error:', error);
          Swal.fire('Error', 'Navigation failed', 'error');
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        Swal.fire('Error', err.error.message || 'An error occurred during login', 'error');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}