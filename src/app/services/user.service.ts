
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'proyecto-backendsw-2025-production.up.railway.app/api/auth';
  private userAdminUrl = 'proyecto-backendsw-2025-production.up.railway.app/api/usuarios';
  // private baseUrl = 'http://localhost:3000/api/auth';
  // private baseUrl = 'https://figmabackend-production.up.railway.app/api/User';
  constructor(private http: HttpClient)
  {

  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }


    // 👤 Funciones de administración de usuarios
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.userAdminUrl);
  }

  createUser(data: any): Observable<any> {
    return this.http.post(`${this.userAdminUrl}/create`, data);
  }
}
