// src/app/services/distribution.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Distribution {
  cantidad_niveles: any;
  id: string;
  nombre: string;
}

@Injectable({ providedIn: 'root' })
export class DistributionService {
  private baseUrl = 'https://proyecto-backendsw-2025-production.up.railway.app/api/distribucion';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Distribution[]> {
    return this.http.get<Distribution[]>(`${this.baseUrl}/all`);
  }

  create(): Observable<any> {
    return this.http.post(`${this.baseUrl}/demo`, {}); 
  }
}
