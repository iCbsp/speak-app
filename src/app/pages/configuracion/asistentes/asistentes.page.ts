import { Component, OnInit } from '@angular/core';

// Alertas - Prompt
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-asistentes',
  templateUrl: './asistentes.page.html',
  styleUrls: ['./asistentes.page.scss'],
})
export class AsistentesPage implements OnInit {

  constructor(
    public alertController: AlertController // Alertas - Prompt
  ) { }

  ngOnInit() {
  }

  async ventanaAnyadirAsistente() {

    const alert = await this.alertController.create({
      cssClass: 'ventanaAnyadirAsistente',
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
          }
        }
      ]
    });

    await alert.present();
  }

}
