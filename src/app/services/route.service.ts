// src/app/services/route.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Route {
  destino: any;
  origen: any;
  tiempo_viaje: any;
  distancia_km: any;
  lugar_destino: string;
  lugar_origen: string;
  id: string;
}

@Injectable({ providedIn: 'root' })
export class RouteService {
  private api = 'http://localhost:3000/api/rutas';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Route[]> {
    return this.http.get<Route[]>(this.api);
  }

  create(route: Partial<Route>): Observable<Route> {
    return this.http.post<Route>(this.api, route);
  }
}
