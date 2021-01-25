import { Component, OnInit } from '@angular/core';

// Alertas - Prompt
import { AlertController } from '@ionic/angular';

// Base de datos
import { DatabaseService } from 'src/app/services/databaseService';

// Actualizar vista
import { ChangeDetectorRef } from '@angular/core';

// Conocer la plataforma del dispositivo
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-asistentes',
  templateUrl: './asistentes.page.html',
  styleUrls: ['./asistentes.page.scss'],
})
export class AsistentesPage implements OnInit {

  asistentes = [];
  asistenteSeleccionado = 0;

  constructor(
    public alertController: AlertController, // Alertas - Prompt
    private changeDetector: ChangeDetectorRef,
    private databaseService:DatabaseService,
    private platform: Platform
  ) {
    if(!platform.is('desktop')){
      databaseService.lista.subscribe((ready)=>{
        if(ready){
          this.consigueAsistentes();
        }
      });
    }
  }


  consigueAsistentes(){
    this.databaseService.lista.subscribe((ready)=>{
      if(ready){
        this.databaseService.obtenAsistentes().then((asistentesBDD)=>{
          this.asistentes = [];
          for(let i = 0; i < asistentesBDD.length; i++){
            this.asistentes.push(asistentesBDD.item(i));
          }
          this.databaseService.obtenAsistenteDeUsuario(this.databaseService.getIdUsuarioActual())
            .then((asistente) => this.asistenteSeleccionado = asistente.id);
          this.changeDetector.detectChanges(); // Para actualizar la vista
        });
      }
    });
  }
  
  async ventanaEditarAsistente(asistente : object) {
    
    const alert = await this.alertController.create({
      cssClass: 'ventanaCrearAsistente',
      header: 'Añadir asistente',
      inputs: [
        {
          name: 'textoSTT',
          type: 'text',
          placeholder: 'Palabra inicial',
          // value: "texto"
        },
        {
          name: 'textoSTT',
          type: 'text',
          placeholder: 'Palabra final',
          // value: "texto"
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancelar',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Aceptar',
          role: 'aceptar',
          handler: data => {
            console.log('Confirm Ok');
            // Meterlo en la base de datos
            // Llamar a changeDetector
          }
        }
      ]
    });
    
    await alert.present();
  }

  borraAsistente(asistenteID : number){
    // Llamar a la BDD
  }
  
  async ventanaCrearAsistente() {
    
    const alert = await this.alertController.create({
      cssClass: 'ventanaCrearAsistente',
      header: 'Añadir asistente',
      inputs: [
        {
          name: 'textoSTT',
          type: 'text',
          placeholder: 'Palabra inicial',
          // value: "texto"
        },
        {
          name: 'textoSTT',
          type: 'text',
          placeholder: 'Palabra final',
          // value: "texto"
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancelar',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Aceptar',
          role: 'aceptar',
          handler: data => {
            console.log('Confirm Ok');
            // Meterlo en la base de datos
            // Llamar a changeDetector
          }
        }
      ]
    });
    
    await alert.present();
  }
  
  ngOnInit() {
  }
}
