import { Component, OnInit } from '@angular/core';

// Popover
import { PopoverController } from '@ionic/angular';

// Base de datos
import { DatabaseService } from 'src/app/services/databaseService';

// Actualizar vista
import { ChangeDetectorRef } from '@angular/core';

// Para saber si es iOS
import { Platform } from '@ionic/angular';

// Router, para pasar parametros
import { Router } from '@angular/router';

import { FilaAccion } from 'src/app/structures'
import { tiposFilas } from 'src/app/enumerations';

@Component({
  selector: 'app-crear-accion-popover',
  templateUrl: './crear-accion-popover.page.html',
  styleUrls: ['./crear-accion-popover.page.scss'],
})
export class CrearAccionPopoverPage implements OnInit {
  
  filas: FilaAccion[];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private popover:PopoverController,
    private router: Router, // Para pasar parametros
    private platform: Platform, 
    private databaseService:DatabaseService
    ) {
  }
  
  ngOnInit() {
    this.filas = new Array();
    this.filas.push(new FilaAccion("Fila fija", tiposFilas.fija));
    this.filas.push(new FilaAccion("Fila temporal", tiposFilas.temporal));
    //[this.filas[0], this.filas[1]] = [this.filas[1], this.filas[0]];
  }

  closePopover(){
    this.popover.dismiss();
  }

  colorDependiendoDelTipo(tipo: tiposFilas){
    if(tipo == tiposFilas.fija) return "#000000";
    else if(tipo == tiposFilas.temporal) return "#808080";
  }
}
