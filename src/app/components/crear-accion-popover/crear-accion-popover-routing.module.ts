import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearAccionPopoverPage } from './crear-accion-popover.page';

const routes: Routes = [
  {
    path: '',
    component: CrearAccionPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearAccionPopoverPageRoutingModule {}
