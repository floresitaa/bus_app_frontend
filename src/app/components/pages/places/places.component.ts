// src/app/components/pages/places/places.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlaceService, Place } from '../../../services/place.service';

@Component({
  selector: 'app-places',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './places.component.html'
})
export class PlacesComponent implements OnInit {
  places: Place[] = [];
  form: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private placeService: PlaceService) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    this.fetchPlaces();
  }

  fetchPlaces() {
    this.loading = true;
    this.placeService.getAll().subscribe({
      next: (data) => {
        this.places = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load places';
        this.loading = false;
      }
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.placeService.create(this.form.value).subscribe({
      next: () => {
        this.form.reset();
        this.fetchPlaces();
      },
      error: () => {
        this.error = 'Error creating place';
      }
    });
  }
}
