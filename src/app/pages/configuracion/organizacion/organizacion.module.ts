import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrganizacionPageRoutingModule } from './organizacion-routing.module';

import { OrganizacionPage } from './organizacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrganizacionPageRoutingModule
  ],
  declarations: [OrganizacionPage]
})
export class OrganizacionPageModule {}
