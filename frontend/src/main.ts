import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/components/home/home.component';
import { NavComponent } from './app/components/nav/nav.component';
import { LoginComponent } from './app/components/login/login.component';
import { RegisterComponent } from './app/components/register/register.component';
import { provideRouter, Routes } from '@angular/router'; // Import provideRouter and Routes
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Define your routes
const routes: Routes = [
  { path: '', component: HomeComponent },  // Home route (default)
  { path: 'login', component: LoginComponent },  // Login route
  { path: 'register', component: RegisterComponent },  // Signup route
  { path: 'nav', component: NavComponent }
];

// Bootstrap the application with routing
bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    provideRouter(routes), provideAnimationsAsync()  // Provide your routes here
  ]
})
.catch((err) => console.error(err));
