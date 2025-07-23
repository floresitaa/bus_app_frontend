import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ importante
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true, // ✅ si usas standalone
  imports: [CommonModule], // ✅ incluye los pipes y directivas básicas
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  error: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar los usuarios';
      }
    });
  }
}


