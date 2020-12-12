import { Component } from '@angular/core';

// Alertas - Prompt
import { AlertController } from '@ionic/angular';

// TTS
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    public alertController: AlertController, // Alertas - Prompt
    private tts: TextToSpeech // TTS
    ){}

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
              //await this.tts.speak({
              this.tts.speak({
                text: 'Alexa, pon una alarma a las ' + data.texto3,
                locale: 'es-ES'
              });
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
