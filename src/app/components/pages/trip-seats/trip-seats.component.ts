import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SeatViaje, TripSeatService } from '../../../services/trip-seat.service';
import { PurchaseService } from '../../../services/purchase.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trip-seats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trip-seats.component.html',
})
export class TripSeatsComponent implements OnInit {
  viajeId!: string;
  levels: any[] = [];
  selectedSeats: {
    asiento_viaje_id: string;
    etiqueta: string;
    precio: number;
    tipo_asiento: string;
    ocupado: boolean;
    pasajero: {
      nombre: string;
      ci: string;
      fechaNacimiento: string;
    };
  }[] = [];

  showPurchaseModal: boolean = false;
  isLoading: boolean = false;
  purchaseSuccess: boolean = false;
  purchaseError: string = '';

  constructor(
    private route: ActivatedRoute,
    private seatService: TripSeatService,
    private purchaseService: PurchaseService
  ) {}

  ngOnInit() {
    this.viajeId = this.route.snapshot.paramMap.get('viaje_id')!;
    this.loadSeats();
  }

  loadSeats() {
    this.seatService.getAvailableSeats(this.viajeId).subscribe({
      next: (data) => {
        const levelsMap: { [nivel: string]: any } = {};
        for (const asiento of data) {
          const nivel = asiento.nivel;
          if (!levelsMap[nivel]) {
            levelsMap[nivel] = {
              nivel,
              descripcion: '',
              asientos: [],
              maxX: 0,
              maxY: 0
            };
          }
          levelsMap[nivel].asientos.push(asiento);
          levelsMap[nivel].maxX = Math.max(levelsMap[nivel].maxX, asiento.x + 1);
          levelsMap[nivel].maxY = Math.max(levelsMap[nivel].maxY, asiento.y + 1);
        }
        this.levels = Object.values(levelsMap);
      }
    });
  }

  getSeatClasses(asiento: any): string[] {
    const classes = [];
    const tipo = (asiento.tipo_asiento || '').toLowerCase();
    const isSelected = this.selectedSeats.some(s => s.asiento_viaje_id === asiento.asiento_viaje_id);

    if (tipo === 'cama') {
      classes.push('rounded-full');
    } else {
      classes.push('rounded');
    }

    if (asiento.ocupado) {
      classes.push('bg-gray-400', 'opacity-60', 'cursor-not-allowed', 'pointer-events-none');
    } else if (isSelected) {
      classes.push('bg-green-500', 'ring-2', 'ring-green-300', 'text-white');
    } else if (tipo === 'cama') {
      classes.push('bg-purple-600', 'text-white');
    } else if (tipo === 'semi_cama') {
      classes.push('bg-blue-600', 'text-white');
    } else {
      classes.push('bg-gray-300', 'text-black');
    }

    return classes;
  }

  toggleSeat(asientoId: string): void {
    const asiento = this.findAsientoById(asientoId);
    if (!asiento || asiento.ocupado) return;

    const index = this.selectedSeats.findIndex(s => s.asiento_viaje_id === asiento.asiento_viaje_id);
    if (index > -1) {
      this.selectedSeats.splice(index, 1);
    } else {
      this.selectedSeats.push({
        asiento_viaje_id: asiento.asiento_viaje_id,
        etiqueta: asiento.etiqueta,
        precio: asiento.precio,
        tipo_asiento: asiento.tipo_asiento,
        ocupado: asiento.ocupado,
        pasajero: {
          nombre: '',
          ci: '',
          fechaNacimiento: ''
        }
      });
    }
  }

  findAsientoById(id: string): any {
    for (const level of this.levels) {
      const found = level.asientos.find((a: any) => a.asiento_viaje_id === id);
      if (found) return found;
    }
    return null;
  }

  openPurchaseModal(content: any) {
    if (this.selectedSeats.length === 0) {
      alert('Por favor seleccione al menos un asiento');
      return;
    }

    this.showPurchaseModal = true;
  }

  confirmPurchase() {
    this.isLoading = true;
    this.purchaseError = '';

    const purchaseData = {
      viaje_id: this.viajeId,
      asientos: this.selectedSeats.map(asiento => ({
        asiento_viaje_id: asiento.asiento_viaje_id,
        pasajero_nombre: asiento.pasajero.nombre,
        pasajero_ci: asiento.pasajero.ci,
        pasajero_fecha_nacimiento: asiento.pasajero.fechaNacimiento
      }))
    };

    this.purchaseService.create(purchaseData).subscribe({
      next: () => {
        this.isLoading = false;
        this.purchaseSuccess = true;
        this.selectedSeats = [];
        this.loadSeats(); // Recargar asientos
      },
      error: (err: any) => {
        this.isLoading = false;
        this.purchaseError = err.error?.detalle || 'Error al procesar la compra';
        console.error('Purchase error:', err);
      }
    });
  }

  getTotal(): number {
    return this.selectedSeats.reduce((sum, asiento) => sum + asiento.precio, 0);
  }
}
