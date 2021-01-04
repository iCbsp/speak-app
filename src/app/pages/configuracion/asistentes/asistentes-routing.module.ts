import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsistentesPage } from './asistentes.page';

const routes: Routes = [
  {
    path: '',
    component: AsistentesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsistentesPageRoutingModule {}
