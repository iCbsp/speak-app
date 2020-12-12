import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrganizacionPage } from './organizacion.page';

const routes: Routes = [
  {
    path: '',
    component: OrganizacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizacionPageRoutingModule {}
