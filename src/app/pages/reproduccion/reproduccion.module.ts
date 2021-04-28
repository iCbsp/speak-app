import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReproduccionPageRoutingModule } from './reproduccion-routing.module';

import { ReproduccionPage } from './reproduccion.page';
import { TextInterpreterComponent } from 'src/app/components/text-interpreter/text-interpreter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReproduccionPageRoutingModule
  ],
  declarations: [ReproduccionPage, TextInterpreterComponent]
})
export class ReproduccionPageModule {}
