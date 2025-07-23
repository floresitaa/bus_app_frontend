
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ esto incluye pipes como date, currency
import { TicketService } from '../../../services/ticket.service';

@Component({
  selector: 'app-tickets',
  standalone: true, // 👈 si estás usando componentes standalone
  imports: [CommonModule],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  tickets: any[] = [];
  error: string = ''; // ✅ Aquí está la solución

  constructor(private ticketService: TicketService) {}

ngOnInit(): void {
  this.ticketService.getTickets().subscribe({
    next: (data) => {
      this.tickets = data;
      console.log('📦 Tickets:', this.tickets); // 👀 importante
    },
    error: (err) => {
      console.error('Error al obtener tickets:', err);
      this.error = 'No se pudieron cargar los tickets. Intenta nuevamente.';
    }
  });
}

}

