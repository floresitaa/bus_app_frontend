import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Bus, BusService } from '../../../services/bus.service';
import { Route, RouteService } from '../../../services/route.service';
import { Trip, TripService } from '../../../services/trip.service';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css'
})
export class TripsComponent implements OnInit{
  form: FormGroup;
  buses: Bus[] = [];
  routes: Route[] = [];
  trips: Trip[] = [];
  error: string | null = null;
  
  private authService = inject(AuthService);
  userInfo = computed(() => {
    const token = this.authService.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log(payload);
      return payload;
    } catch (err) {
      return null;
    }
  });
  isAdmin = computed(() => this.userInfo()?.tipo_usuario === 'administrador');
  isPasajero = computed(() => this.userInfo()?.tipo_usuario === 'pasajero');

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
    this.routeService.getAll().subscribe(
      { 
        next:(resp: any) => {
          console.log(resp);
          this.routes = resp;
        },
        error: (error: any) => {
          console.log(error);
        }

      }
    );
    this.tripService.getAll().subscribe(
      { 
        next: (resp: any) => {
          console.log(resp);
          this.trips = resp;
        },
        error: (error: any) => {
          console.log(error);
          
        }

      });
  }

  submit() {
    if (this.form.invalid) return;

    this.tripService.create(this.form.value).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.tripService.generarAsientos(resp.id).subscribe({
          next: (resp: any) => {
            console.log(resp);
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
    console.log(this.routes);
    const route = this.routes.find(r => r.id === id);
    return route ? `${route.origen.nombre} ➡️ ${route.destino.nombre}` : 'Unknown';
  }
}
