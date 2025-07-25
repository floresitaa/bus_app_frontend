// src/app/services/place.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Place {
  id?: number;
  nombre: string;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  private apiUrl = 'https://proyecto-backendsw-2025-production.up.railway.app/api/lugares';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Place[]> {
    return this.http.get<Place[]>(this.apiUrl);
  }

  create(place: Place): Observable<Place> {
    return this.http.post<Place>(this.apiUrl, place);
  }
}
