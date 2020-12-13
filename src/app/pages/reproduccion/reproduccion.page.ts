import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

// TTS
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

// STT
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx'
import { ChangeDetectorRef } from '@angular/core'; // Si no se usa no actualiza el input

// Para saber si es iOS
import { Platform } from '@ionic/angular';

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
  STTActivado = false;
  STTCancelado = false;

  constructor(
    private route: ActivatedRoute, // Para recibir los parametros del Router
    private tts: TextToSpeech, // TTS
    private plt: Platform, private speechRecognition: SpeechRecognition, private cd: ChangeDetectorRef // Si el STT no va: public navCtrl: NavController
    ){

    // Recogida del texto
    this.route.params.subscribe(params => {
      this.textoAReproducir = params['textoAReproducir'];
      this.STTActivado = params['STTActivado'];
      console.log(params['textoAReproducir']);
    });

    //this.diElTextoTrasEsperar();
  }

  // diElTextoTrasEsperar(){
  //   setTimeout(() => {
  //     this.diTTS()
  //   }, 1000);
  // }

  // Metodos TTS
  async diTTS():Promise<any>{
    try{
      await this.tts.speak({
        text: this.textoAReproducir,
        locale: 'es-ES',
        rate: 0.8
      });
      console.log("Successfully said " + this.textoAReproducir);
      //alert("El TTS ha terminado");
      this.reproduciendo = false;
      if(this.STTActivado && !this.STTCancelado) this.iniciaSTT();
    }
    catch(e){
      if(e == "cordova_not_available") console.log(e);
      //else alert("diTTS: Ha surgido un error relacionado con el Text To Speech");
    }
  }

  estaReproduciendo(){
    return this.reproduciendo;
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

  estaGrabando(){
    return this.grabando;
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
      else this.primeraCoincidencia = "No ha habido respuesta";

      this.grabando = false;
      this.cd.detectChanges(); // Para actualizar la vista

    }, (error) => {
      this.grabando = false;
      this.primeraCoincidencia = "No ha habido respuesta";
      this.cd.detectChanges(); // Para actualizar la vista
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

  // Al iniciar la pagina
  ngOnInit() {
    this.diTTS();
  }

}
