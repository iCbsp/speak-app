import { Component, OnInit } from '@angular/core';

// Para recibir los parametros
import { ActivatedRoute } from '@angular/router';

// TTS
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

// STT
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx'
import { ChangeDetectorRef } from '@angular/core'; // Si no se usa no actualiza el input

// Para saber si es iOS
import { Platform } from '@ionic/angular';

// Alertas - Prompt
import { AlertController } from '@ionic/angular';

// Base de datos
import { DatabaseService } from 'src/app/services/databaseService';
import { EmojiStringComponent } from 'src/app/components/emoji-string/emoji-string.component';

@Component({
  selector: 'app-reproduccion',
  templateUrl: './reproduccion.page.html',
  styleUrls: ['./reproduccion.page.scss'],
})
export class ReproduccionPage implements OnInit {

  // Variables TTS
  textoAReproducir = "";
  reproduciendo = true;

  // Variables STT
  coincidencias: String[];
  primeraCoincidencia = new String("");
  grabando = false;
  permisoSTT = false;

  configuracion = { modo_simple: 1, respuesta: 1 };
  STTCancelado = false;
  resultado = '';

  constructor(
    private route: ActivatedRoute, // Para recibir los parametros del Router
    private tts: TextToSpeech, // TTS
    private plt: Platform, private speechRecognition: SpeechRecognition, private changeDetector: ChangeDetectorRef, // Si el STT no va: public navCtrl: NavController
    public alertController: AlertController, // Alertas - Prompt
    private platform: Platform,
    private databaseService:DatabaseService,
    private emojiString: EmojiStringComponent
    ){}

  ngOnInit() {
    
    // Recogida del texto
    this.route.params.subscribe(params => {
      this.textoAReproducir = params['textoAReproducir'];
      this.configuracion.respuesta = params['respuesta'];
      this.configuracion.modo_simple = params['modo_simple'];

      this.actualizaPermisoSTT().then(() => {
        if(this.configuracion.respuesta == 1 && !this.permisoSTT){
          // while(this.configuracion.respuesta == 1 && !this.permisoSTT){
            this.ventanaNoTienePermisoSTT().then(() => {
              this.diTextoAReproducir();
  
            });
  
          // }
        } else this.diTextoAReproducir();
      });

      console.log(params['textoAReproducir']);
    });
  }

  consigueConfiguracion(){
    this.databaseService.lista.subscribe((ready)=>{
      if(ready){
        this.databaseService.obtenConfiguracion().then((configuracionBDD)=>{
          this.configuracion = configuracionBDD;
        });
      }
    });
  }

  // diElTextoTrasEsperar(){
  //   setTimeout(() => {
  //     this.diTextoAReproducir()
  //   }, 1000);
  // }

  // Metodos TTS
  async diTTS(texto: string):Promise<any>{
    var textoSinEmoticonos = this.emojiString.removeEmojis(texto);
    try{
      await this.tts.speak({
        text: textoSinEmoticonos,
        locale: 'es-ES',
        rate: 0.8
      });
    }
    catch(e){
      if(e == "cordova_not_available") console.log(e);
    }
  }

  async diTextoAReproducir():Promise<any>{
    var textoSinEmoticonos = this.emojiString.removeEmojis(this.textoAReproducir);
    try{
      await this.tts.speak({
        text: textoSinEmoticonos,
        locale: 'es-ES',
        rate: 0.8
      });
      console.log("Successfully said " + this.textoAReproducir);
      //alert("El TTS ha terminado");
      this.reproduciendo = false;
      if(this.configuracion.respuesta == 1 && !this.STTCancelado) this.iniciaSTT();
    }
    catch(e){
      if(e == "cordova_not_available") console.log(e);
      //else alert("diTextoAReproducir: Ha surgido un error relacionado con el Text To Speech");
    }
  }

  async pararTTS(){
    console.log("parando TTS");
    this.STTCancelado = true;
    try{
      await this.tts.speak("");
      this.reproduciendo = false;
    }
    catch(e){
      if(e == "cordova_not_available") console.log(e);
      else alert("pararTTS: Ha surgido un error relacionado con el Text To Speech");
    }
  }


  // Metodos STT
  esIOS() {
    return this.plt.is('ios');
  }

  tienePermisoSTT(){
    return this.permisoSTT;
  }

  actualizaPermisoSTT(){
    return this.speechRecognition.hasPermission()
    .then((hasPermission: boolean) => {
      this.permisoSTT = hasPermission;
    });
  }

  iniciaSTT(){
    this.grabando = true;
    this.changeDetector.detectChanges(); // Para actualizar la vista
    let options = {
      // language: 'en-US'
      language: 'es-ES'
    }
    this.speechRecognition.startListening().subscribe(coincidenciasTemp => {
      this.coincidencias = coincidenciasTemp;

      if(this.coincidencias.length > 0 && this.coincidencias[0] != "") this.primeraCoincidencia = this.coincidencias[0];
      else this.primeraCoincidencia = "(No ha habido respuesta ❌)";

      this.grabando = false;
      this.resultado = 'bien';
      this.changeDetector.detectChanges(); // Para actualizar la vista

    }, (error) => {
      this.grabando = false;
      this.resultado = 'mal';
      this.primeraCoincidencia = "(No ha habido respuesta ❌)";
      this.changeDetector.detectChanges(); // Para actualizar la vista
    }
    );
    // this.grabando = true;
    //alert("Ha parado" + this.reproduciendo + this.grabando);
  }

  paraSTT(){
    this.speechRecognition.stopListening().then(() => {
      this.grabando = false;
    });
  }

  pidePermisoSTT() {
    return this.speechRecognition.requestPermission().finally(() => {
      return this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {
        this.permisoSTT = hasPermission;
      });
    });
  }

  // Interfaz
  iconoResultado(){
    if(!this.reproduciendo && !this.grabando) return this.resultado;
  }

  reiniciaAccion(){
    // Variables TTS
    this.reproduciendo = true;

    // Variables STT
    this.coincidencias = [];
    this.primeraCoincidencia = new String("");
    this.grabando = false;
    // this.permisoSTT = false;
    this.STTCancelado = false;
    this.resultado = '';

    // Lo mismo que al iniciar la pagina
    this.diTextoAReproducir();

    this.changeDetector.detectChanges();
  }

  async ventanaNoTienePermisoSTT() {

    const alert = await this.alertController.create({
      cssClass: 'ventanaNoTienePermisoSTT',
      backdropDismiss: false,
      header: 'Permiso micrófono',
      message: 'La opción de respuesta está activada, pero la aplicación no tiene permiso para utilizar el micrófono. Puede darle permiso o desactivar la función de respuesta.',
      buttons: [
        {
          text: 'Desactivar respuesta',
          handler: () => {
            console.log('Confirm Desactivar respuesta');
            this.databaseService.cambiaRespuesta(false).then(() => {
              this.configuracion.respuesta = 0;
              alert.dismiss();
            });
          }
        }, {
          text: 'Dar permiso',
          handler: () => {
            console.log('Confirm Dar permiso');
            this.pidePermisoSTT().then(()=>{
              if(this.permisoSTT) alert.dismiss();
              else return false;
            }).finally(()=>{
              if(this.permisoSTT) alert.dismiss();
              else return false;
            });
            return false;
          }
        }
      ]
    });

    await alert.present();

    return alert.onDidDismiss();
  }

}
