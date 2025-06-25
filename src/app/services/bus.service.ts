import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Bus {
  id?: string;
  placa: string;
  imagen: string;
  descripcion: string;
  capacidad_pasajeros: number;
  distribucion_asientos_id: string;
}

@Injectable({ providedIn: 'root' })
export class BusService {
  private baseUrl = 'http://localhost:3000/api/buses';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Bus[]> {
    return this.http.get<Bus[]>(this.baseUrl);
  }

  create(data: Bus): Observable<Bus> {
    return this.http.post<Bus>(this.baseUrl, data);
  }
}
