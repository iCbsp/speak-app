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
    private databaseService:DatabaseService
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
              this.diTTS();
  
            });
  
          // }
        } else this.diTTS();
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
  //     this.diTTS()
  //   }, 1000);
  // }

  // Function created by lucas and kos. Source: https://stackoverflow.com/a/41164587 (CC BY-SA 4.0)
  removeEmojis (string) {
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
  
    return string.replace(regex, '');
  }

  // Metodos TTS
  async diTTS():Promise<any>{
    var textoSinEmoticonos = this.removeEmojis(this.textoAReproducir);

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
      //else alert("diTTS: Ha surgido un error relacionado con el Text To Speech");
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
    let options = {
      // language: 'en-US'
      language: 'es-ES'
    }
    this.speechRecognition.startListening().subscribe(coincidenciasTemp => {
      this.coincidencias = coincidenciasTemp;

      if(this.coincidencias.length > 0 && this.coincidencias[0] != "") this.primeraCoincidencia = this.coincidencias[0];
      else this.primeraCoincidencia = "(No ha habido respuesta)";

      this.grabando = false;
      this.resultado = 'bien';
      this.changeDetector.detectChanges(); // Para actualizar la vista

    }, (error) => {
      this.grabando = false;
      this.resultado = 'mal';
      this.primeraCoincidencia = "(No ha habido respuesta)";
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
  estaGrabando(){
    return this.grabando;
  }

  estaReproduciendo(){
    return this.reproduciendo;
  }

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
    this.permisoSTT = false;
    this.STTCancelado = false;
    this.resultado = '';

    // Lo mismo que al iniciar la pagina
    this.diTTS();
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
