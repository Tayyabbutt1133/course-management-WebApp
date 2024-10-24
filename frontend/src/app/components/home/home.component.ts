import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Emitters } from '../emitters/emitter';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'], // Corrected from styleUrl to styleUrls
})
export class HomeComponent {
  message: string = ""; // Correctly initialize as an empty string

  // Initializing
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('http://localhost:5000/api/user', {
      withCredentials: true, 
    })
      .subscribe(
        (res: any) => {
          this.message = `Hi ${res.name}`;
          Emitters.authEmitter.emit(true)
        },
        (error) => {
          this.message = "You are not logged in"
          Emitters.authEmitter.emit(false)
        }
      );
  }
}
