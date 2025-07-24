// login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule ]
})
export class LoginComponent {
  error: string | null = null;

  form: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {

    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', Validators.required]
    });
  }

  login() {
    if (this.form.invalid) return;

    this.auth.login(this.form.value).subscribe({
      next: (resp: any) => 
      {
        console.log(resp);
        this.router.navigate(['/dashboard'])
      },
      error: (err) => this.error = err.error?.error || 'Error de autenticación'
    });
  }
}
