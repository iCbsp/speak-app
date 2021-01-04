import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfiguracionPage } from './configuracion.page';

const routes: Routes = [
  {
    path: '',
    component: ConfiguracionPage
  },
  {
    path: 'perfiles',
    loadChildren: () => import('./perfiles/perfiles.module').then( m => m.PerfilesPageModule)
  },  {
    path: 'accesibilidad',
    loadChildren: () => import('./accesibilidad/accesibilidad.module').then( m => m.AccesibilidadPageModule)
  },
  {
    path: 'organizacion',
    loadChildren: () => import('./organizacion/organizacion.module').then( m => m.OrganizacionPageModule)
  },
  {
    path: 'asistentes',
    loadChildren: () => import('./asistentes/asistentes.module').then( m => m.AsistentesPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiguracionPageRoutingModule {}
