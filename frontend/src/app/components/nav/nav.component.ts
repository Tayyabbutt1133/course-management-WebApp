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
  isAdmin = false;
  user: any = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.authenticated = auth;
      if (auth) {
        this.checkUserRole();
      }
    });
  }

  checkUserRole(): void {
    this.http.get('http://localhost:5000/api/user', {
      withCredentials: true
    }).subscribe({
      next: (res: any) => {
        this.user = res;
        this.isAdmin = res.role === 'admin';
      },
      error: () => {
        this.isAdmin = false;
        this.user = null;
      }
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(): void {
    this.http.post('http://localhost:5000/api/logout', {}, {
      withCredentials: true
    }).subscribe(() => {
      this.isAdmin = false;
      this.user = null;
      Emitters.authEmitter.emit(false);
      this.router.navigate(['/login']);
    });
  }
}