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
  selectedSeats: any[] = [];
  showPurchaseModal: boolean = false;
  passengerData: any = {};
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

  // loadSeats() {
  //   this.seatService.getAvailableSeats(this.viajeId).subscribe({
  //     next: (data: SeatViaje[]) => {

  //       console.log(data);
  //       const levelsMap: { [nivel: number]: any } = {};
  //       for (const asiento of data) {
  //         if (!levelsMap[asiento.nivel]) {
  //           levelsMap[asiento.nivel] = {
  //             nivel: asiento.nivel,
  //             descripcion: asiento.descripcion || '',
  //             asientos: []
  //           };
  //         }
  //         levelsMap[asiento.nivel].asientos.push(asiento);
  //       }
  //       this.levels = Object.values(levelsMap);
  //     },
  //     error: (err) => console.error('Error loading seats', err)
  //   });
  // }

  loadSeats() {
    this.seatService.getAvailableSeats(this.viajeId).subscribe({
      next: (data) => {
        console.log(data);
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


  // toggleSeat(id: string) {
  //   const idx = this.selectedSeats.indexOf(id);
  //   if (idx > -1) this.selectedSeats.splice(idx, 1);
  //   else this.selectedSeats.push(id);
  // }

  // getSeatClasses(seat: any): string[] {
  //   const base = ['text-white', 'border', 'border-gray-300'];
  
  //   const isSelected = this.selectedSeats.includes(seat.asiento_viaje_id);
  //   const typeClass = seat.tipo_asiento === 'cama' 
  //     ? 'bg-purple-600' 
  //     : 'bg-blue-500';
  
  //   return [
  //     ...base,
  //     typeClass,
  //     isSelected ? 'ring-4 ring-green-400' : 'hover:ring-2 hover:ring-blue-300'
  //   ];
  // }
  getSeatClasses(asiento: any): string[] {
    console.log(asiento);
    const classes = [];
  
    const tipo = (asiento.tipo_asiento || '').toLowerCase();
    const isSelected = this.selectedSeats.includes(asiento.etiqueta);

    if (tipo === 'cama') {
      classes.push('rounded-full');
    } else if (tipo === 'semi_cama') {
      classes.push('rounded');
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

  
  
  toggleSeat(asientoId: number): void {
    const asiento = this.findAsientoById(asientoId);
    if (!asiento || asiento.ocupado) return;
  
    const index = this.selectedSeats.indexOf(asiento.etiqueta);
    if (index > -1) {
      this.selectedSeats.splice(index, 1);
    } else {
      this.selectedSeats.push(asiento.etiqueta);
    }
  }
  
  findAsientoById(id: number): any {
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
  }
  
  confirmPurchase() {

    this.isLoading = true;
    this.purchaseError = '';

    const purchaseData = {
      viaje_id: this.viajeId,
      asientos: this.selectedSeats.map(asiento => ({
        asiento_viaje_id: asiento.asiento_viaje_id,
        pasajero_nombre: this.passengerData.nombre,
        pasajero_ci: this.passengerData.ci,
        pasajero_fecha_nacimiento: this.passengerData.fechaNacimiento
      }))
    };

    this.purchaseService.create(purchaseData).subscribe({
      next: (resp: any) => {
        this.isLoading = false;
        this.purchaseSuccess = true;
        this.selectedSeats = [];
        this.loadSeats(); // Recargar asientos para actualizar disponibilidad
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
