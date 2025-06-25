import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'bus_app_frontend';
  constructor(public router: Router) {}
  
  hideNavbarRoutes = ['/login', '/register'];

  isLoginRoute(): boolean {
    return this.router.url === '/login' || this.router.url === '/register';
  }
}
