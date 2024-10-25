// register.component.ts
import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Emitters } from '../emitters/emitter';  // Add this import

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form: FormGroup;
  roles = [
    { value: 'teacher', label: 'Teacher' },
    { value: 'student', label: 'Student' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
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

    this.http.post("http://localhost:5000/api/register", this.form.value, {
      withCredentials: true
    }).subscribe({
      next: (response: any) => {
        Swal.fire('Success', 'Registration successful!', 'success');
        Emitters.authEmitter.emit(true);  // Emit authentication state
        this.router.navigate(['/']);  // Navigate to home instead of login
      },
      error: (err) => {
        Swal.fire('Error', err.error.message || 'An error occurred during registration', 'error');
      }
    });
  }
}