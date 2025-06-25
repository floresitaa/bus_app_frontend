import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private tokenKey = 'auth-token';

  isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) {}

  login(data: { correo: string; contraseña: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data).pipe(
      tap((res) => {
        const decoded = this.decodeToken(res.token);
        console.log(decoded);
        const tipoUsuario = decoded?.tipo_usuario;
        console.log('Rol:', tipoUsuario);
        sessionStorage.setItem(this.tokenKey, res.token);
        this.isLoggedIn$.next(true);
      })
    );
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout() {
    sessionStorage.clear();
    sessionStorage.removeItem(this.tokenKey);
    this.isLoggedIn$.next(false);
    this.router.navigate(['/login']);
  }

  getToken() {
    return sessionStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!sessionStorage.getItem(this.tokenKey);
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (e) {
      return null;
    }
  }

}
