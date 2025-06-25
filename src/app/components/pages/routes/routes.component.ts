import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouteService, Route } from '../../../services/route.service';
import { Place, PlaceService } from '../../../services/place.service';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './routes.component.html'
})
export class RoutesComponent implements OnInit {
  routes: Route[] = [];
  places: Place[] = [];
  form: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private routeService: RouteService,
    private placeService: PlaceService
  ) {
    this.form = this.fb.group({
      lugar_origen: ['', Validators.required],
      lugar_destino: ['', Validators.required],
      distancia_km: ['', [Validators.required, Validators.min(1)]],
      tiempo_viaje: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.fetchRoutes();
    this.placeService.getAll().subscribe(p => this.places = p);
  }

  fetchRoutes() {
    this.routeService.getAll().subscribe({
      next: (data) => this.routes = data,
      error: () => this.error = 'Failed to load routes'
    });
  }

  getPlaceName(id: string): string {
    const place = this.places.find((p: any) => p.id === id);
    return place ? place.nombre : 'Unknown';
  }

  submit() {
    if (this.form.invalid) return;

    this.routeService.create(this.form.value).subscribe({
      next: () => {
        this.form.reset();
        this.fetchRoutes();
      },
      error: () => this.error = 'Error creating route'
    });
  }
}
