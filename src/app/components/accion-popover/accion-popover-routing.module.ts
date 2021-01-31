import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccionPopoverPage } from './accion-popover.page';

const routes: Routes = [
  {
    path: '',
    component: AccionPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccionPopoverPageRoutingModule {}
