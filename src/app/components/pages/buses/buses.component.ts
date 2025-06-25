import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BusService, Bus } from '../../../services/bus.service';
import { Distribution, DistributionService } from '../../../services/distribution.service';

@Component({
  selector: 'app-buses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './buses.component.html'
})
export class BusesComponent implements OnInit {
  buses: Bus[] = [];
  distributions: Distribution[] = [];
  form: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private busService: BusService,
    private distributionService: DistributionService
  ) {
    this.form = this.fb.group({
      placa: ['', Validators.required],
      imagen: [''],
      descripcion: ['', Validators.required],
      capacidad_pasajeros: ['', [Validators.required, Validators.min(1)]],
      distribucion_asientos_id: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.distributionService.getAll().subscribe({
      next: (d) => {
        this.distributions = d;
        if (d.length === 0) {
          this.error = '⚠️ You must create a seat distribution before registering a bus.';
        }
      }
    });
  
    this.busService.getAll().subscribe({
      next: (data) => (this.buses = data)
    });
  }

  submit() {
    if (this.form.invalid) {
      console.warn('❌ Formulario inválido', this.form.value);
      this.form.markAllAsTouched(); 
      return;
    }
    
    const formData = {
      ...this.form.value,
      imagen: this.form.value.imagen || 'https://via.placeholder.com/100x70?text=Bus'
    };

    this.busService.create(this.form.value).subscribe({
      next: () => {
        this.form.reset();
        this.fetchData();
      },
      error: () => this.error = 'Failed to create bus'
    });
  }

  getDistributionName(id: string): string {
    const d = this.distributions.find(x => x.id === id);
    return d?.nombre || 'Unknown';
  }
}
