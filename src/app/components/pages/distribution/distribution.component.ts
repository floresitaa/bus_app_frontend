import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributionService, Distribution } from '../../../services/distribution.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-distribution',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './distribution.component.html'
})
export class DistributionComponent implements OnInit {
  distributions: Distribution[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(private distributionService: DistributionService) {}

  ngOnInit(): void {
    this.loadDistributions();
  }

  loadDistributions() {
    this.loading = true;
    this.distributionService.getAll().subscribe({
      next: (data) => {
        this.distributions = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load distributions';
        this.loading = false;
      }
    });
  }

  createDemoDistribution() {
    this.loading = true;
    this.distributionService.create().subscribe({
      next: () => {
        this.success = 'Demo distribution created!';
        this.error = null;
        this.loadDistributions();
      },
      error: () => {
        this.error = 'Error creating distribution';
        this.success = null;
        this.loading = false;
      }
    });
  }
}
