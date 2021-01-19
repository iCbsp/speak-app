import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearPerfilPage } from './crear-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: CrearPerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearPerfilPageRoutingModule {}
