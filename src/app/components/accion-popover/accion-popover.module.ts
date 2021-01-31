import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccionPopoverPageRoutingModule } from './accion-popover-routing.module';

import { AccionPopoverPage } from './accion-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccionPopoverPageRoutingModule
  ],
  declarations: [AccionPopoverPage]
})
export class AccionPopoverPageModule {}
