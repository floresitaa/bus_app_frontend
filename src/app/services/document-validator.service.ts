// src/app/services/document-validator.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DocumentValidatorService {
  private apiUrl = 'http://localhost:3000/api/validar-docs/validar';

  constructor(private http: HttpClient) {}

  validarCarnets(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
}
