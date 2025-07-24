// src/app/services/trip-seat.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface SeatViaje {
  ocupado: boolean;
  asiento_viaje_id: string;
  etiqueta: string;
  tipo_asiento: string;
  nivel: number;
  x: number;
  y: number;
  precio: number;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TripSeatService {
  private baseUrl = 'https://proyecto-backendsw-2025-production.up.railway.app/api/asiento-viaje';

  constructor(private http: HttpClient) {}

  getAvailableSeats(viajeId: string): Observable<SeatViaje[]> {
    return this.http.get<SeatViaje[]>(`${this.baseUrl}/${viajeId}/disponibles`);
  }
}
