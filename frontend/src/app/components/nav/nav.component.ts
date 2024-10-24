// nav.component.ts
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Emitters } from '../emitters/emitter';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, CommonModule, HttpClientModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  authenticated = false;
  isMobileMenuOpen = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to authentication state changes
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.authenticated = auth;
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(): void {
    this.http.post('http://localhost:5000/api/logout', {}, {
      withCredentials: true
    }).subscribe(() => {
      // Update authentication state
      Emitters.authEmitter.emit(false);
      // Redirect to login page
      this.router.navigate(['/login']);
    });
  }
}
