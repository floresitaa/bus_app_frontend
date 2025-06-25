// register.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule]
})
export class RegisterComponent {
  error: string | null = null;

  form: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {

    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', Validators.required],
      nombre: ['', Validators.required],
      ci: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      tipo_usuario: ['cliente', Validators.required]
    });
  }

  register() {
    if (this.form.invalid) return;

    this.auth.register(this.form.value).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => this.error = err.error?.error || 'Error al registrarse'
    });
  }
}
