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
  
  async ventanaEditarAsistente(asistente : any) {
    
    const alert = await this.alertController.create({
      cssClass: 'ventanaEditarAsistente',
      header: 'Editar asistente',
      inputs: [
        {
          name: 'inicial',
          type: 'text',
          placeholder: 'Palabra inicial',
          value: asistente.inicial
        },
        {
          name: 'final',
          type: 'text',
          placeholder: 'Palabra final',
          value: asistente.final
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
            this.databaseService.editaAsistente(asistente.id, data.inicial, data.final)
            .then(() => {
              this.consigueAsistentes();
            });
          }
        }
      ]
    });
    
    await alert.present();
  }

  borraAsistente(asistenteID : number){
    this.databaseService.borraAsistente(asistenteID)
      .then(() => {
        this.consigueAsistentes();
    });
  }
  
  async ventanaCrearAsistente() {
    
    const alert = await this.alertController.create({
      cssClass: 'ventanaCrearAsistente',
      header: 'Añadir asistente',
      inputs: [
        {
          name: 'inicial',
          type: 'text',
          placeholder: 'Palabra inicial',
          // value: "texto"
        },
        {
          name: 'final',
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
            this.databaseService.publicaAsistente(data.inicial, data.final).then(() => {
              this.consigueAsistentes();
            });
          }
        }
      ]
    });
    
    await alert.present();
  }
  
  ngOnInit() {
  }
}
