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
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiguracionPageRoutingModule {}
