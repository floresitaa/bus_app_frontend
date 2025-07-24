// src/app/services/trip.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Trip {
  id: string;
  bus_id: string;
  ruta_id: string;
  hora_salida: string;
  hora_llegada: string;
}

@Injectable({ providedIn: 'root' })
export class TripService {
  private baseUrl = 'https://proyecto-backendsw-2025-production.up.railway.app/api/viajes/';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.baseUrl+"buscar");
  }

  create(data: Partial<Trip>): Observable<Trip> {
    return this.http.post<Trip>(this.baseUrl+"create", data);
  }

  generarAsientos(viajeId: string) {
  return this.http.post(`https://proyecto-backendsw-2025-production.up.railway.app/api/asiento-viaje/generar/${viajeId}`, {});
}
analizarViaje(viajeId: string) {
  return this.http.post<any>('https://proyecto-backendsw-2025-production.up.railway.app/api/analizar', {
    viaje_id: viajeId
  });
}


}
