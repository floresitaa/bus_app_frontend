import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SeatViaje, TripSeatService } from '../../../services/trip-seat.service';
import { PurchaseService } from '../../../services/purchase.service';
import { FormsModule } from '@angular/forms';
import { DocumentValidatorService } from '../../../services/document-validator.service';

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
    imagenesCI: {
      frontal: File | null;
      reverso: File | null;
    };
  }[] = [];

  showPurchaseModal: boolean = false;
  isLoading: boolean = false;
  purchaseSuccess: boolean = false;
  purchaseError: string = '';

  constructor(
    private route: ActivatedRoute,
    private seatService: TripSeatService,
    private purchaseService: PurchaseService,
    private docValidator: DocumentValidatorService
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
    const isSelected = this.isSeatSelected(asiento);

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

  isSeatSelected(asiento: SeatViaje): boolean {
    return this.selectedSeats.some(s => s.asiento_viaje_id === asiento.asiento_viaje_id);
  }

  toggleSeat(asiento: SeatViaje): void {
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
        },
        imagenesCI: {
          frontal: null,
          reverso: null
        }
      });
    }
  }

  openPurchaseModal() {
    if (this.selectedSeats.length === 0) {
      alert('Por favor seleccione al menos un asiento');
      return;
    }
    this.showPurchaseModal = true;
  }

  closeModal() {
    this.showPurchaseModal = false;
  }

  confirmPurchase() {
    this.isLoading = true;
    this.purchaseError = '';

    const formData = new FormData();
    formData.append('viaje_id', this.viajeId);

    this.selectedSeats.forEach((s, i) => {
      formData.append(`boletos[${i}][asiento_id]`, s.asiento_viaje_id);
      formData.append(`boletos[${i}][pasajero_nombre]`, s.pasajero?.nombre || '');
      formData.append(`boletos[${i}][pasajero_ci]`, s.pasajero?.ci || '');
      formData.append(`boletos[${i}][pasajero_fecha_nacimiento]`, s.pasajero?.fechaNacimiento || '');

      if (s.imagenesCI?.frontal) {
        formData.append(`boletos[${i}][ci_frontal]`, s.imagenesCI.frontal);
      }
      if (s.imagenesCI?.reverso) {
        formData.append(`boletos[${i}][ci_reverso]`, s.imagenesCI.reverso);
      }
    });

    this.purchaseService.create(formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.purchaseSuccess = true;
        this.selectedSeats = [];
        this.loadSeats();
      },
      error: (err) => {
        this.isLoading = false;
        this.purchaseError = err.error?.detalle || 'Error al procesar la compra';
        console.error('Purchase error:', err);
      }
    });
  }

  onFileSelected(event: any, asiento: any, lado: 'frontal' | 'reverso') {
    const file = event.target.files[0];
    if (!asiento.imagenesCI) asiento.imagenesCI = {};
    asiento.imagenesCI[lado] = file;

    if (asiento.imagenesCI.frontal && asiento.imagenesCI.reverso) {
      const formData = new FormData();
      formData.append('ci_frontal', asiento.imagenesCI.frontal);
      formData.append('ci_reverso', asiento.imagenesCI.reverso);

      this.docValidator.validarCarnets(formData).subscribe({
        next: (resp) => {
          if (resp.mayores?.length || resp.menores?.length) {
            const datos = [...resp.mayores, ...resp.menores][0];
            asiento.pasajero = {
              nombre: datos.nombre || '',
              ci: datos.ci || '',
              fechaNacimiento: datos.fecha_nacimiento || ''
            };
          }
        },
        error: (err) => {
          console.error('Error al validar documento:', err);
        }
      });
    }
  }

  getTotal(): number {
    return this.selectedSeats.reduce((sum, asiento) => sum + parseFloat(asiento.precio.toString()), 0);
  }

  getTotalFormatted(): string {
    return this.getTotal().toFixed(2);
  }
}
