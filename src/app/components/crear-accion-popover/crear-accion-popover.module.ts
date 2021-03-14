import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearAccionPopoverPageRoutingModule } from './crear-accion-popover-routing.module';

import { CrearAccionPopoverPage } from './crear-accion-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearAccionPopoverPageRoutingModule
  ],
  declarations: [CrearAccionPopoverPage]
})
export class CrearAccionPopoverPageModule {}
