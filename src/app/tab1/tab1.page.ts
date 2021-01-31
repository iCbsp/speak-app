import { Component } from '@angular/core';

// Alertas - Prompt
import { AlertController } from '@ionic/angular';

// Router, para pasar parametros
import { Router } from '@angular/router';

// Base de datos
import { DatabaseService } from '../services/databaseService';

// Para saber si es iOS
import { Platform } from '@ionic/angular';

// Para actualizar la vista
import { ChangeDetectorRef } from '@angular/core';

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
    private router: Router // Para pasar parametros
  ){
    if(!platform.is('desktop')){
      this.databaseService.lista.subscribe((ready)=>{
        if(ready){
          this.consigueAcciones();
        }
      });
    }
  }
  
  consigueAcciones(){
    this.databaseService.obtenAcciones(1).then((accionesBDD) => {
      this.acciones = [];
      if(accionesBDD) {
        for(let i = 0; i < accionesBDD.length; i++)
          this.acciones.push(accionesBDD.item(i));
      }
      this.changeDetector.detectChanges();
    });
  }

  async ventanaAccion() {

    var header = "Alarma";

    const alert = await this.alertController.create({
      cssClass: 'ventanaAccion',
      header: header,
      inputs: [
        {
          name: 'texto1',
          type: 'text',
          value: 'Alexa,',
          disabled: true
        },
        {
          name: 'texto2',
          type: 'text',
          value: 'pon una alarma a las ',
          disabled: true
        },
        {
          name: 'texto3',
          type: 'text',
          value: '18:30',
          disabled: false
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancelar',
          handler: () => {
          }
        },
        {
          text: 'Aceptar',
          role: 'aceptar',
          handler: data => {
            try{
              //this.navCtrl.navigateForward(['configuracion'], true);
              this.router.navigate(['reproduccion', 
              {
                textoAReproducir: 'Alexa, pon una alarma a las ' + data.texto3,
                STTActivado: true
              }]);
            }
            catch(e){
              console.log(e);
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
