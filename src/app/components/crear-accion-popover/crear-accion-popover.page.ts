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
import { tiposAcciones, tiposFilas } from 'src/app/enumerations';

@Component({
  selector: 'app-crear-accion-popover',
  templateUrl: './crear-accion-popover.page.html',
  styleUrls: ['./crear-accion-popover.page.scss'],
})
export class CrearAccionPopoverPage implements OnInit {
  
  filas: FilaAccion[];
  filaId = 0;
  nombreAccion = "";

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
    this.filas.push(new FilaAccion(this.filaId++, "", tiposFilas.fija));
    this.filas.push(new FilaAccion(this.filaId++, "", tiposFilas.temporal));
  }

  closePopover(){
    this.popover.dismiss();
  }

  mueveFilaArriba(id: number){
    for(let fila = 0; fila < this.filas.length; fila++){
      if(this.filas[fila].id == id && fila > 0){
        [this.filas[fila-1], this.filas[fila]] = [this.filas[fila], this.filas[fila-1]];
        break;
      }
    }
    this.changeDetector.detectChanges();
  }

  mueveFilaAbajo(id: number){
    for(let fila = 0; fila < this.filas.length; fila++){
      if(this.filas[fila].id == id && fila < this.filas.length-1){
        [this.filas[fila+1], this.filas[fila]] = [this.filas[fila], this.filas[fila+1]];
        break;
      }
    }
    this.changeDetector.detectChanges();
  }

  creaFila(tipo: string){
    if(tipo == 't') this.filas.push(new FilaAccion(this.filaId++, "Fila temporal", tiposFilas.temporal));
    else if(tipo == 'f') this.filas.push(new FilaAccion(this.filaId++, "Fila fija", tiposFilas.fija));
  }

  borraFila(id: number){
    for(let fila = 0; fila < this.filas.length; fila++){
      if(this.filas[fila].id == id) this.filas.splice(fila, 1);
    }
  }

  creaAccion(){
    if(this.filas && this.filas.length){
      this.databaseService.publicaAccion(tiposAcciones.personalizadas, this.nombreAccion, undefined, this.filas).then(() => {
        this.closePopover();
      });
    } else alert("Para crear una acción es necesario que haya al menos una fila");
  }

  colorDependiendoDelTipo(tipo: tiposFilas){
    if(tipo == tiposFilas.fija) return "#808080";
    else if(tipo == tiposFilas.temporal) return "#000000";
  }
}
