import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './components/pages/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: '**', redirectTo: 'login' }             
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
