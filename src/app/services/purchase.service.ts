// purchase.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private apiUrl = 'https://proyecto-backendsw-2025-production.up.railway.app/api/boletos';

  constructor(private http: HttpClient) { }

  createPurchase(purchaseData: any) {
    return this.http.post(`${this.apiUrl}/purchases`, purchaseData);
  }

  getPurchaseDetails(purchaseId: string) {
    return this.http.get(`${this.apiUrl}/purchases/${purchaseId}`);
  }

  create(purchaseData: any) {
    return this.http.post(`${this.apiUrl}/create`, purchaseData);
  }
}
