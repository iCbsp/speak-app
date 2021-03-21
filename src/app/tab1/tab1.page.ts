import { Component } from '@angular/core';

// Alertas - Prompt
import { AlertController } from '@ionic/angular';

// Base de datos
import { DatabaseService } from '../services/databaseService';

// Para saber si es iOS
import { Platform } from '@ionic/angular';

// Para actualizar la vista
import { ChangeDetectorRef } from '@angular/core';

// Popover
import { PopoverController } from '@ionic/angular';
import { AccionPopoverPage } from 'src/app/components/accion-popover/accion-popover.page';

import { TiposAcciones } from 'src/app/enumerations';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  acciones = [];

  constructor(
    public alertController: AlertController, // Alertas - Prompt
    private databaseService:DatabaseService,
    private platform: Platform,
    private changeDetector: ChangeDetectorRef,
    private popover:PopoverController
  ){}

  ngOnInit() {
    if(!this.platform.is('desktop')){
      this.databaseService.lista.subscribe((ready)=>{
        if(ready){
          this.consigueAcciones();
        }
      });
      this.databaseService.cambio.subscribe(()=>{
        // alert("Cambio en la base de datos");
      });
    }
  }
  
  consigueAcciones(){
    this.databaseService.obtenAcciones(TiposAcciones.basicas).then((accionesBDD) => {
      this.acciones = [];
      if(accionesBDD) {
        for(let i = 0; i < accionesBDD.length; i++)
          this.acciones.push(accionesBDD.item(i));
      }
      this.changeDetector.detectChanges();
    });
  }
  
  createPopover(accion){
    if(!this.platform.is('desktop') && accion){
      this.popover.create({
      component:AccionPopoverPage,
      componentProps: {
        accion: accion
      },
      showBackdrop: true
      }).then((popoverElement)=>{
        popoverElement.present();
      })
    }
  }

}
