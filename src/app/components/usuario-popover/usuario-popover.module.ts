import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuarioPopoverPageRoutingModule } from './usuario-popover-routing.module';

import { UsuarioPopoverPage } from './usuario-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuarioPopoverPageRoutingModule
  ],
  declarations: [UsuarioPopoverPage]
})
export class UsuarioPopoverPageModule {}
