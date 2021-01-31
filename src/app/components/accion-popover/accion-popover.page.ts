import { Component, OnInit } from '@angular/core';

// Popover
import { PopoverController } from '@ionic/angular';

// Base de datos
import { DatabaseService } from 'src/app/services/databaseService';

// Actualizar vista
import { ChangeDetectorRef } from '@angular/core';

// Para saber si es iOS
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-accion-popover',
  templateUrl: './accion-popover.page.html',
  styleUrls: ['./accion-popover.page.scss'],
})
export class AccionPopoverPage implements OnInit {

  accion = { id: 0, titulo: "Error en la acción" };
  filas = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private popover:PopoverController,
    private platform: Platform, 
    private databaseService:DatabaseService
  ) {
  }
  
  closePopover(){
    this.popover.dismiss();
  }
  
  ngOnInit() {
    if(!this.platform.is('desktop')){
      this.databaseService.lista.subscribe((ready)=>{
        if(ready){
          if(!this.accion.id) alert("No se ha recibido el id de la accion");
          this.databaseService.obtenFilas(this.accion.id).then((filasBDD) => {
            this.filas = [];
            if(filasBDD) {
              for(let i = 0; i < filasBDD.length; i++)
                this.filas.push(filasBDD.item(i));
              this.changeDetector.detectChanges();
            }
          });
        }
      });
    }
  }
}
