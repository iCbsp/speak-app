import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilesPage } from './perfiles.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilesPage
  },
  {
    path: 'editar-perfil',
    loadChildren: () => import('./editar-perfil/editar-perfil.module').then( m => m.EditarPerfilPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilesPageRoutingModule {}
