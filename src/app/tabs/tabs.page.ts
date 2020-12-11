import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

// Para saber si es iOS
import { Platform } from '@ionic/angular';

// TTS
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

// STT
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx'
import { ChangeDetectorRef } from '@angular/core'; // Si no se usa no actualiza el input

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  // Var TTS
  texto: string;
  // Var STT
  coincidencias: String[];
  estaGrabando = false;
  permisoSTT = false;

  constructor(  private menu: MenuController,
                private tts: TextToSpeech, // TTS
                private plt: Platform, private speechRecognition: SpeechRecognition, private cd: ChangeDetectorRef // Si el STT no va: public navCtrl: NavController
              ){}


  // Metodos TTS
  async diTTS():Promise<any>{
    try{
      await this.tts.speak({
        text: this.texto,
        locale: 'es-ES'
      });
      console.log("Successfully said " + this.texto);
    }
    catch(e){
      console.log(e);
    }
  }

  // Metodos STT
  esIOS() {
    return this.plt.is('ios');
  }

  tienePermisoSTT(){
    return this.permisoSTT;
  }

  iniciaSTT(){
    let options = {
      language: 'en-US'
    }
    this.speechRecognition.startListening().subscribe(coincidencias => {
      this.coincidencias = coincidencias;
      this.cd.detectChanges(); // Para actualizar la vista
    });
    this.estaGrabando = true;
  }

  paraSTT(){
    this.speechRecognition.stopListening().then(() => {
      this.estaGrabando = false;
    });
  }

  pidePermisoSTT() {
    this.speechRecognition.hasPermission()
    .then((hasPermission: boolean) => {
      if(hasPermission){
        this.iniciaSTT();
      } else {
        this.speechRecognition.requestPermission();
      }
      this.permisoSTT = hasPermission;
    });
  }

  // openFirst() {
  //   this.menu.enable(true, 'first');
  //   this.menu.open('first');
  // }

  // openEnd() {
  //   this.menu.open('end');
  // }

  // openCustom() {
  //   this.menu.enable(true, 'custom');
  //   this.menu.open('custom');
  // }

  customPopoverOptions: any = {
    //header: 'Asistente'
  };
}
