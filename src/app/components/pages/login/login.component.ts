import { CommonModule } from '@angular/common';
import { Component, ViewChild, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email = '';
  password = '';

  showRegisterModal = false;
  registerData = {
    name: '',
    email: '',
    password: ''
  };
  
  constructor(private userService: UserService, private router: Router)
  {

  }

  login() {
    console.log('Login enviado', this.email, this.password);
    this.userService.login({ Email: this.email, Password: this.password })
      .subscribe({
        next: (res: any) => {
          console.log('Login exitoso', res);
          sessionStorage.setItem("userId", res.data);
          
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Usuario logueado con exitoso",
            showConfirmButton: false,
            timer: 2500
          });

          setTimeout(() => {
            this.router.navigate(['/scores']);
          }, 2700);
        },
        error: (err: any) => {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: err.error,
            showConfirmButton: false,
            timer: 2500
          });
          console.error('Error al iniciar sesión', err);
        }
      });
  }

  openRegisterModal() {
    this.showRegisterModal = true;
  }

  closeRegisterModal() {
    this.showRegisterModal = false;
  }

  registerUser() {
    console.log('Usuario registrado', this.registerData);

    this.userService.register({
      Email: this.registerData.email,
      Password: this.registerData.password,
      Username: this.registerData.name
    }).subscribe({
      next: (res: any) => {
        console.log(res);
        console.log('Usuario registrado correctamente', res);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: 'Usuario registrado correctamente',
          showConfirmButton: false,
          timer: 2500
        });
        this.closeRegisterModal();
      },
      error: (err : any) => {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: err,
          showConfirmButton: false,
          timer: 3000
        });
        console.error('Error al registrar usuario', err);
      }
    });
  }

}
