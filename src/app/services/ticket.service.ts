
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'proyecto-backendsw-2025-production.up.railway.app/api/boletos/detallado'; // Ajusta la URL si es necesario

  constructor(private http: HttpClient) {}

  getTickets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
