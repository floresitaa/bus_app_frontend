import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/pages/login/login.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { PlacesComponent } from './components/pages/places/places.component';
import { RoutesComponent } from './components/pages/routes/routes.component';
import { BusesComponent } from './components/pages/buses/buses.component';
import { DistributionComponent } from './components/pages/distribution/distribution.component';
import { TripsComponent } from './components/pages/trips/trips.component';
import { DashboardHomeComponent } from './components/pages/dashboard-home/dashboard-home.component';
import { SeatsComponent } from './components/pages/seats/seats.component';
import { TripSeatsComponent } from './components/pages/trip-seats/trip-seats.component';
import { TicketsComponent } from './components/pages/tickets/tickets.component';
import { UsersComponent } from './components/pages/users/users.component';

//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   { path: 'login', component: LoginComponent },
//   { path: 'register', component: RegisterComponent },
//   {
//     path: '',
//     component: DashboardComponent,
//     children: [
//       { path: '', component: DashboardHomeComponent },
//       { path: 'places', component: PlacesComponent },
//       { path: 'routes', component: RoutesComponent },
//       { path: 'buses', component: BusesComponent },
//       { path: 'distribution', component: DistributionComponent },
//       { path: 'trips', component: TripsComponent },
//     ]
//   },
//   { path: '**', redirectTo: 'login' }
// ];
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'places', component: PlacesComponent },
      { path: 'routes', component: RoutesComponent },
      { path: 'buses', component: BusesComponent },
      { path: 'distribution', component: DistributionComponent },
      { path: 'trips', component: TripsComponent },
      { path: 'seats', component: SeatsComponent },
      { path: 'trips/:viaje_id/seats', component: TripSeatsComponent },
      { path: 'tickets', component: TicketsComponent },
      { path: 'users', component: UsersComponent }

    ]
  },

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
