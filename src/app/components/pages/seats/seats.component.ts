import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-seats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seats.component.html',
})
export class SeatsComponent implements OnInit {
  distributions: any[] = [];
  levels: any[] = [];
  selectedDistributionId: string | null = null;
  loading = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDistributions();
  }

  loadDistributions() {
    this.http.get<any[]>('http://localhost:3000/api/distribucion').subscribe({
      next: (data) => (this.distributions = data)
    });
  }

  onSelectDistribution() {
    if (!this.selectedDistributionId) return;

    this.loading = true;
    this.http.get<any[]>(`http://localhost:3000/api/distribucion/${this.selectedDistributionId}/niveles`).subscribe({
      next: async (niveles) => {
        const nivelesConAsientos = await Promise.all(
          niveles.map(async (nivel) => {
            const asientos = await this.http.get<any[]>(`http://localhost:3000/api/niveles/${nivel.id}/asientos`).toPromise();
            return { ...nivel, asientos };
          })
        );
        this.levels = nivelesConAsientos;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  getSeatClasses(seat: any): string[] {
    const base = ['w-10', 'h-10', 'rounded', 'flex', 'items-center', 'justify-center', 'text-xs', 'font-semibold', 'absolute'];
    
    if (seat.tipo === 'conductor' || seat.tipo === 'especial') {
      return [...base, 'bg-yellow-400', 'text-black'];
    }
  
    if (seat.estado === 'ocupado') {
      return [...base, 'bg-red-500', 'text-white'];
    }
  
    return [...base, 'bg-blue-600', 'text-white']; // default: disponible
  }

}
