import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private authService = inject(AuthService);
  userInfo = computed(() => {
    const token = this.authService.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log(payload);
      return payload;
    } catch (err) {
      return null;
    }
  });
  
  isAdmin = computed(() => this.userInfo()?.tipo_usuario === 'administrador');
  isPasajero = computed(() => this.userInfo()?.tipo_usuario === 'pasajero');

}
