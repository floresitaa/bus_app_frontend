import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Bus, BusService } from '../../../services/bus.service';
import { Route, RouteService } from '../../../services/route.service';
import { TripService } from '../../../services/trip.service';
import { RouterModule } from '@angular/router';

export interface AnalisisIA {
  es_recomendable: boolean;
  resumen_analisis: string;
  puntos_positivos: string[];
  puntos_negativos: string[];
  advertencias_contexto: string[];
}

export interface AlternativaViaje {
  id: string;
  hora_salida: string;
  hora_llegada: string;
  bus: string;
}

export interface Trip {
  id: string;
  bus_id: string;
  ruta_id: string;
  hora_salida: string;
  hora_llegada: string;
  viaje_evaluado?: {
    origen: string;
    destino: string;
    fecha_salida: string;
    fecha_llegada: string;
    precio: number;
  };
  analisis_ia?: AnalisisIA;
  alternativas?: AlternativaViaje[];
}

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css'
})
export class TripsComponent implements OnInit {
  form: FormGroup;
  buses: Bus[] = [];
  routes: Route[] = [];
  trips: Trip[] = [];
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private busService: BusService,
    private routeService: RouteService
  ) {
    this.form = this.fb.group({
      bus_id: ['', Validators.required],
      ruta_id: ['', Validators.required],
      hora_salida: ['', Validators.required],
      hora_llegada: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.fetchData();
  }

 fetchData() {
  this.busService.getAll().subscribe({ next: data => this.buses = data });
  this.routeService.getAll().subscribe({ next: resp => this.routes = resp });

  this.tripService.getAll().subscribe({
    next: (viajes) => {
      this.trips = viajes;
      this.trips.forEach((trip, index) => {
        this.tripService.analizarViaje(trip.id).subscribe({
          next: (analisis) => {
            this.trips[index] = { ...trip, ...analisis };
          },
          error: (err) => console.error(`Error analizando viaje ${trip.id}`, err)
        });
      });
    },
    error: (error) => console.log(error)
  });
}


  submit() {
    if (this.form.invalid) return;

    this.tripService.create(this.form.value).subscribe({
      next: (resp: any) => {
        this.tripService.generarAsientos(resp.id).subscribe({
          next: () => {
            this.form.reset();
            this.fetchData();
          },
          error: () => this.error = 'Error al generar los asientos para el viaje'
        });
      },
      error: () => this.error = 'Error creating trip'
    });
  }

  getBusPlate(id: string): string {
    return this.buses.find(b => b.id === id)?.placa || 'Unknown';
  }

  getRouteLabel(id: string): string {
    const route = this.routes.find(r => r.id === id);
    return route ? `${route.origen.nombre} ➡️ ${route.destino.nombre}` : 'Unknown';
  }
}
