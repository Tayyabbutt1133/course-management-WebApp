// register.component.ts
import { Component } from '@angular/core';
import { RouterLink, Router} from '@angular/router';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]

    });
  }


   validateEmail = (email:any) => {
    // Define a regex pattern for email validation
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  
    // Match the email against the regex
    if (email.match(validRegex)) {
      return true;
    } else {
      return false;
    }
  };






  submit(): void {
    let user = this.form.getRawValue()
    console.log(user);

    if (user.name== "" || user.email=="" || user.password=="")
    {
      Swal.fire("Error", "Please Fill all the field", "error");
    }
    else if (!this.validateEmail(user.email))
    {
      Swal.fire("Error", "Please enter valid email", "error");
    }
    else
    {
      this.http.post("http://localhost:5000/api/register", user,{
        withCredentials: true
      })
        .subscribe(() => this.router.navigate(['/']), (err) => {
          Swal.fire("Error", err.error.message, "error")
      })
      }

  }
}