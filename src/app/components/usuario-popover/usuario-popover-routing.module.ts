import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuarioPopoverPage } from './usuario-popover.page';

const routes: Routes = [
  {
    path: '',
    component: UsuarioPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuarioPopoverPageRoutingModule {}
