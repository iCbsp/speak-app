import { Component } from '@angular/core';
import { AlertInput, MenuController } from '@ionic/angular';

// Alertas - Prompt
import { AlertController } from '@ionic/angular';

// Para saber si es iOS
import { Platform } from '@ionic/angular';

// Router, para pasar parametros
import { Data, Router } from '@angular/router';

// STT
// import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';

// Para actualizar la vista
import { ChangeDetectorRef } from '@angular/core';

// Base de datos
// import { DatabaseService } from '../services/databaseService';

// Para detectar cambios en la URL
import { Location } from '@angular/common';

// Popover
import { PopoverController } from '@ionic/angular';
// import { UsuarioPopoverPage } from 'src/app/components/usuario-popover/usuario-popover.page';

// Emojis
// import { EmojiStringComponent } from '../components/emoji-string/emoji-string.component';
// import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

// borrar y poner en reproduccion
import { TextToSpeech as talk } from '@ionic-native/text-to-speech';

import { SpeechRecognition as listen } from '@ionic-native/speech-recognition';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  asistente = "Alexa";

  configuracion = { modo_simple: 0, respuesta: 1, ventana_politicas: 1, ventana_accesibilidad: 1 };

  // Var STT
  estaGrabando = false;
  permisoSTT = false;

  usuarios = [];
  usuarioSeleccionado = { id: 0, nombre: "Usuario", color: "#FFFFFF" };
  asistentes = [];
  asistenteSeleccionado = "0";

  ventanaPoliticasAbierta = false;
  ventanaAccesibilidadAbierta = false;

  constructor(  
    private menu: MenuController, // Menu desplegable
    private router: Router, // Para pasar parametros
    public alertController: AlertController, // Alertas - Prompt
    private platform: Platform,
    // private speechRecognition: SpeechRecognition, 
    // private tts: TextToSpeech,
    private changeDetector: ChangeDetectorRef,
    // private databaseService:DatabaseService,
    // private location: Location,
    // private popover:PopoverController,
    // private emojiString: EmojiStringComponent
  ){}

  ngOnInit() {
    this.actualizaPermisoSTT();

    // if(!this.platform.is('desktop')){
    //   this.databaseService.lista.subscribe((ready)=>{
    //     if(ready){
    //       this.consigueUsuarios();
    //       this.consigueAsistentes();
    //       this.consigueConfiguracion().then(() => this.comprobacionesVentanas());
          
    //       this.databaseService.cambio.subscribe(()=>{
    //         this.consigueUsuarios();
    //         this.consigueAsistentes();
    //         this.actualizaPermisoSTT();
    //         this.consigueConfiguracion().then(() => this.comprobacionesVentanas());
    //         this.changeDetector.detectChanges();
    //       });
    //     }
    //   });
    // }
  }

  createPopover(){
    // if(!this.platform.is('desktop')){
    //   if(this.configuracion.modo_simple == 1) this.diTTS('Perfiles');

    //   this.popover.create({
    //   component:UsuarioPopoverPage,
    //   cssClass: 'accionPopover',
    //   showBackdrop: true
    //   }).then((popoverElement)=>{
    //     popoverElement.present();
    //   })
    // }
  }

  comprobacionesVentanas(){
  //   if(!this.ventanaPoliticasAbierta && !this.configuracion.ventana_politicas) this.ventanaPoliticas();
  //   if(!this.ventanaAccesibilidadAbierta && !this.configuracion.ventana_accesibilidad) this.ventanaAccesibilidad();
  // }

  // consigueConfiguracion(){
  //   let promesa = new Promise<any>(() => {});
  //   this.databaseService.lista.subscribe((ready)=>{
  //     if(ready){
  //       promesa = this.databaseService.obtenConfiguracion().then((configuracionBDD)=>{
  //         this.configuracion = configuracionBDD;
  //       });
  //     }
  //   });
  //   return promesa;
  }

  consigueUsuarios(){
  //   this.databaseService.lista.subscribe((ready)=>{
  //     if(ready){
  //       this.databaseService.obtenUsuariosSesion().then((usuariosBDD)=>{
  //         this.usuarios = [];
  //         for(let i = 0; i < usuariosBDD.length; i++)
  //           this.usuarios.push(usuariosBDD.item(i));
  //         this.usuarioSeleccionado = this.usuarios[0];
  //         this.changeDetector.detectChanges(); // Para actualizar la vista
  //       });
  //     }
  //   });
  }

  consigueAsistentes(){
  //   this.databaseService.lista.subscribe((ready)=>{
  //     if(ready){
  //       this.databaseService.obtenAsistentes().then((asistentesBDD)=>{
  //         this.asistentes = [];
  //         for(let i = 0; i < asistentesBDD.length; i++){
  //           this.asistentes.push(asistentesBDD.item(i));
  //         }
  //         this.databaseService.obtenAsistenteDeUsuario(this.usuarioSeleccionado.id)
  //           .then((asistente) => {
  //             if(asistente) {
  //               // this.asistenteSeleccionado = String(asistente.id);
  //               this.asistenteSeleccionado = asistente.asistente;
  //             } else {
  //               this.asistenteSeleccionado = "0";
  //             }
  //             this.changeDetector.detectChanges();
  //           });
  //       });
  //     }
  //   });
  }

  cambiaAsistente(){
  //   this.databaseService.cambiaAsistente(parseInt(this.asistenteSeleccionado));
  }

  tienePermisoSTT(){
    return this.permisoSTT;
  }

  funcionEnDesarrollo(){
    alert("Lo siento, función en desarrollo");
  }

  actualizaPermisoSTT(){
    listen.hasPermission()
    .then((hasPermission: boolean) => {
      this.permisoSTT = hasPermission;
      this.changeDetector.detectChanges(); // Para actualizar la vista
    });
  }

  iniciaSTT(){
    let options = {
      language: 'es-ES'
    }
    let respuesta = "";
    listen.startListening().subscribe(coincidencias => {
      // a futuro igual mejor poner la lista entera de coincidencias
      if(coincidencias && coincidencias.length) respuesta = coincidencias[0];
      this.ventanaRespuesta(respuesta);
      this.changeDetector.detectChanges(); // Para actualizar la vista
    }, (err) => {
      console.log(err);
      this.ventanaRespuesta(respuesta);
      this.changeDetector.detectChanges(); // Para actualizar la vista
    });
    this.estaGrabando = true;
  }

  paraSTT(){
  //   this.speechRecognition.stopListening().then(() => {
  //     this.estaGrabando = false;
  //   });
  }

  pidePermisoSTT() {
    listen.hasPermission()
    .then((hasPermission: boolean) => {
      if(hasPermission){
        this.iniciaSTT();
      } else {
        listen.requestPermission();
      }
      this.permisoSTT = hasPermission;
    });
  }

  async ventanaTextoManual() {
    // let inicialTexto = "cortana";
    // let finalTexto = "gracias";

    // if(this.asistenteSeleccionado && this.asistentes.length){
    //   this.asistentes.forEach(asistente => {
    //     if(asistente.id == this.asistenteSeleccionado) {
    //       if(asistente.inicial.length) inicialTexto = asistente.inicial;
    //       if(asistente.final.length) finalTexto = asistente.final;
    //     }
    //   });
    // }

    let inputs: AlertInput[] = [];
    inputs.push(
        {
          name: 'asistente',
          type: 'text',
          placeholder: "Asistente",
          disabled: false,
        }
    );
    inputs.push(
        {
          name: 'texto',
          type: 'text',
          placeholder: "Acción a realizar",
          disabled: false
        }
    );
    // if(finalTexto.length) inputs.push(
    //     {
    //       name: 'asistenteFinal',
    //       type: 'text',
    //       disabled: true,
    //       value: " " + finalTexto
    //     }
    // );

    const alert = await this.alertController.create({
      cssClass: 'ventanaTextoManual',
      header: 'Acción manual',
      inputs: inputs,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancelar',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Enviar',
          role: 'enviar',
          handler: data => {
            console.log('Confirm Ok');
            let texto = "";
            
            borrarYSustituirPorReproduccion(data.asistente + " " + data.texto);
            
            // if(data.asistenteInicial != undefined) texto += data.asistenteInicial;
            // texto += data.texto;
            // if(data.asistenteFinal != undefined) texto += data.asistenteFinal;
            // this.router.navigate(['reproduccion', {
            //   textoAReproducir: texto,
            //   respuesta: this.configuracion.respuesta,
            //   modo_simple: this.configuracion.modo_simple
            // }]);
          }
        }
      ]
    });

    await alert.present();
  }

  async ventanaRespuesta(respuesta: any){
    
    let subHeader = "";
    let message = "";

    if(respuesta != null && respuesta.length){
      subHeader = "Esto es lo que el dispositivo ha escuchado (✔):";
      message = respuesta;
    } else subHeader = "El dispositivo no ha escuchado nada (❌)";

    const alert = await this.alertController.create({
      cssClass: 'ventanaTextoManual',
      subHeader: subHeader,
      message: message,
      buttons: [
        {
          text: 'Aceptar',
          role: 'aceptar',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  async ventanaAccesibilidad() {
    // this.ventanaAccesibilidadAbierta = true;
    // const alert = await this.alertController.create({
    //   cssClass: 'ventanaAccesibilidad',
    //   header: 'Accesibilidad',
    //   message: 'Seleccione los perfiles que se adecúen a su situación. Estos ajustes se podrán cambiar en cualquier momento.',
    //   backdropDismiss: false,
    //   inputs: [
    //     {
    //       name: 'checkbox1',
    //       type: 'checkbox',
    //       label: 'Dislexia',
    //       value: 'value1'
    //       //checked: true
    //     },
    //     {
    //       name: 'checkbox2',
    //       type: 'checkbox',
    //       label: 'Daltonismo',
    //       value: 'value2'
    //     },
    //     {
    //       name: 'checkbox3',
    //       type: 'checkbox',
    //       label: 'Visión reducida',
    //       value: 'value3'
    //     }
    //   ],
    //   buttons: [
    //     {
    //       text: 'Aceptar',
    //       role: 'aceptar',
    //       handler: () => {
    //         this.ventanaAccesibilidadAbierta = false;
    //         console.log('Confirm Ok');
    //       }
    //     }
    //   ]
    // });

    // await alert.present();
  }
  async ventanaPoliticas() {
    // this.ventanaPoliticasAbierta = true;
    // const alert = await this.alertController.create({
    //   cssClass: 'ventanaPoliticas',
    //   header: 'Políticas y uso de los datos',
    //   message: 'Esta aplicación guarda los datos de forma local. Herramientas de su dispositivo como el "Speech to Text" podrían recoger datos durante su uso. Para más información acceda a nuestra <a href="https://carlosbsp.com/politica-de-privacidad-speak-app/">página web</a>.',
    //   backdropDismiss: false,
    //   buttons: [
    //     {
    //       text: 'Aceptar',
    //       role: 'aceptar',
    //       handler: () => {
    //         console.log('Confirm Ok');
    //         this.databaseService.cambiaVentanaPoliticas(true);
    //         this.ventanaPoliticasAbierta = false;
    //       }
    //     }
    //   ]
    // });

    // await alert.present();
  }

  // Metodos TTS
  async diTTS(texto: string):Promise<any>{
  //   var textoSinEmoticonos = this.emojiString.removeEmojis(texto);
  //   try{
  //     await this.tts.speak({
  //       text: textoSinEmoticonos,
  //       locale: 'es-ES',
  //       rate: 0.8
  //     });
  //   }
  //   catch(e){
  //     if(e == "cordova_not_available") console.log(e);
  //   }
  // }

  // async pararTTS(){
  //   try{
  //     await this.tts.speak("");
  //   }
  //   catch(e){
  //     if(e == "cordova_not_available") console.log(e);
  //     else alert("pararTTS: Ha surgido un error relacionado con el Text To Speech");
  //   }
  }

  customPopoverOptions: any = {
  };
}

function borrarYSustituirPorReproduccion(texto: string) {
  talk.speak({
    text: texto,
    locale: 'es-ES',
    rate: 0.8
  }).then(function () {
    // alert('success');
  }, function (reason) {
      // alert(reason);
  });
}

