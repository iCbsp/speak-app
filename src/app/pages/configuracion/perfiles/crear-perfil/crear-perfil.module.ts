import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearPerfilPageRoutingModule } from './crear-perfil-routing.module';

import { CrearPerfilPage } from './crear-perfil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearPerfilPageRoutingModule
  ],
  declarations: [CrearPerfilPage]
})
export class CrearPerfilPageModule {}
