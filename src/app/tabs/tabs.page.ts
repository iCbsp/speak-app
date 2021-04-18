import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

// Alertas - Prompt
import { AlertController } from '@ionic/angular';

// Para saber si es iOS
import { Platform } from '@ionic/angular';

// Router, para pasar parametros
import { Data, Router } from '@angular/router';

// STT
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';

// Para actualizar la vista
import { ChangeDetectorRef } from '@angular/core';

// Base de datos
import { DatabaseService } from '../services/databaseService';

// Para detectar cambios en la URL
import { Location } from '@angular/common';

// Popover
import { PopoverController } from '@ionic/angular';
import { UsuarioPopoverPage } from 'src/app/components/usuario-popover/usuario-popover.page';

// Emojis
import { EmojiStringComponent } from '../components/emoji-string/emoji-string.component';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  asistente = "Alexa";

  configuracion = { modo_simple: 1, respuesta: 1 };

  preguntadaAccesibilidad = true;
  preguntadoUsoDeDatos = true;

  // Var STT
  estaGrabando = false;
  permisoSTT = false;

  usuarios = [];
  usuarioSeleccionado = { id: 0, nombre: "", color: "#FFFFFF" };
  asistentes = [];
  asistenteSeleccionado = "0";

  constructor(  
    private menu: MenuController, // Menu desplegable
    private router: Router, // Para pasar parametros
    public alertController: AlertController, // Alertas - Prompt
    private platform: Platform,
    private speechRecognition: SpeechRecognition, 
    private changeDetector: ChangeDetectorRef,
    private databaseService:DatabaseService,
    private location: Location,
    private popover:PopoverController,
    private emojiString: EmojiStringComponent
  ){}

  ngOnInit() {
    if(!this.preguntadoUsoDeDatos) this.ventanaPoliticas();
    if(!this.preguntadaAccesibilidad) this.ventanaAccesibilidad();
    this.actualizaPermisoSTT();

    if(!this.platform.is('desktop')){
      this.databaseService.lista.subscribe((ready)=>{
        if(ready){
          this.consigueUsuarios();
          this.consigueAsistentes();
          this.consigueConfiguracion();
          
          this.databaseService.cambio.subscribe(()=>{
            this.consigueUsuarios();
            this.consigueAsistentes();
            this.actualizaPermisoSTT();
            this.consigueConfiguracion();
          });
        }
      });
    }
  }

  createPopover(){
    if(!this.platform.is('desktop')){
      this.popover.create({
      component:UsuarioPopoverPage,
      showBackdrop: true
      }).then((popoverElement)=>{
        popoverElement.present();
      })
    }
  }

  consigueConfiguracion(){
    let promesa = new Promise<any>(() => {});
    this.databaseService.lista.subscribe((ready)=>{
      if(ready){
        promesa = this.databaseService.obtenConfiguracion().then((configuracionBDD)=>{
          this.configuracion = configuracionBDD;
        });
      }
    });
    return promesa;
  }

  consigueUsuarios(){
    this.databaseService.lista.subscribe((ready)=>{
      if(ready){
        this.databaseService.obtenUsuariosSesion().then((usuariosBDD)=>{
          this.usuarios = [];
          for(let i = 0; i < usuariosBDD.length; i++)
            this.usuarios.push(usuariosBDD.item(i));
          this.usuarioSeleccionado = this.usuarios[0];
          this.changeDetector.detectChanges(); // Para actualizar la vista
        });
      }
    });
  }

  consigueAsistentes(){
    this.databaseService.lista.subscribe((ready)=>{
      if(ready){
        this.databaseService.obtenAsistentes().then((asistentesBDD)=>{
          this.asistentes = [];
          for(let i = 0; i < asistentesBDD.length; i++){
            this.asistentes.push(asistentesBDD.item(i));
          }
          this.databaseService.obtenAsistenteDeUsuario(this.usuarioSeleccionado.id)
            .then((asistente) => {
              if(asistente) {
                // this.asistenteSeleccionado = String(asistente.id);
                this.asistenteSeleccionado = asistente.asistente;
              } else {
                this.asistenteSeleccionado = "0";
              }
              this.changeDetector.detectChanges();
            });
        });
      }
    });
  }

  cambiaAsistente(){
    this.databaseService.cambiaAsistente(parseInt(this.asistenteSeleccionado));
  }

  tienePermisoSTT(){
    return this.permisoSTT;
  }

  actualizaPermisoSTT(){
    this.speechRecognition.hasPermission()
    .then((hasPermission: boolean) => {
      this.permisoSTT = hasPermission;
    });
  }

  iniciaSTT(){
    let options = {
      // language: 'en-US'
      language: 'es-ES'
    }
    let respuesta = "";
    this.speechRecognition.startListening().subscribe(coincidencias => {
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

  async ventanaTextoManual() {
    let inicialTexto = "";
    let finalTexto = "";

    if(this.asistenteSeleccionado && this.asistentes.length){
      this.asistentes.forEach(asistente => {
        if(asistente.id == this.asistenteSeleccionado) {
          if(asistente.inicial.length) inicialTexto = asistente.inicial;
          if(asistente.final.length) finalTexto = asistente.final;
        }
      });
    }

    let inputs = [];
    if(inicialTexto.length) inputs.push(
        {
          name: 'asistenteInicial',
          type: 'text',
          disabled: true,
          value: inicialTexto + ","
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
    if(finalTexto.length) inputs.push(
        {
          name: 'asistenteFinal',
          type: 'text',
          disabled: true,
          value: " " + finalTexto
        }
    );

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
            if(data.asistenteInicial != undefined) texto += data.asistenteInicial;
            texto += data.texto;
            if(data.asistenteFinal != undefined) texto += data.asistenteFinal;
            this.router.navigate(['reproduccion', {textoAReproducir: texto}]);
          }
        }
      ]
    });

    await alert.present();
  }

  async ventanaRespuesta(respuesta){
    
    let subHeader = "";
    let message = "";

    if(respuesta != null && respuesta.length){
      subHeader = "Esto es lo que el dispositivo ha escuchado:";
      message = respuesta;
    } else subHeader = "El dispositivo no ha escuchado nada";

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
    const alert = await this.alertController.create({
      cssClass: 'ventanaAccesibilidad',
      header: 'Accesibilidad',
      //subHeader: 'subHeader',
      message: 'Seleccione los perfiles que se adecúen a su situación. Estos ajustes se podrán cambiar en cualquier momento.',
      backdropDismiss: false,
      inputs: [
        {
          name: 'checkbox1',
          type: 'checkbox',
          label: 'Dislexia',
          value: 'value1'
          //checked: true
        },
        {
          name: 'checkbox2',
          type: 'checkbox',
          label: 'Daltonismo',
          value: 'value2'
        },
        {
          name: 'checkbox3',
          type: 'checkbox',
          label: 'Visión reducida',
          value: 'value3'
        }
      ],
      buttons: [
        {
          text: 'Aceptar',
          role: 'aceptar',
          handler: () => {
            console.log('Confirm Ok');
            this.preguntadaAccesibilidad = true;
          }
        }
      ]
    });

    await alert.present();
  }
  async ventanaPoliticas() {
    const alert = await this.alertController.create({
      cssClass: 'ventanaPoliticas',
      header: 'Uso de los datos',
      message: 'Los datos se guardan de forma local. Para más información acceda a nuestra <a href="https://carlosbsp.com/Action-Speech/">página web</a>.',
      backdropDismiss: false,
      // inputs: [
      //   {
      //     name: 'textoSTT',
      //     type: 'text',
      //     //placeholder: 'Acción a realizar',
      //     value: this.asistente + ", "
      //   }
      // ],
      buttons: [
        // {
        //   text: 'Salir',
        //   role: 'salir',
        //   cssClass: 'secondary',
        //   handler: () => {
        //     console.log('Confirm Cancel');
        //   }
        // }, 
        {
          text: 'Aceptar',
          role: 'aceptar',
          handler: () => {
            console.log('Confirm Ok');
            this.preguntadoUsoDeDatos = true;
          }
        }
      ]
    });

    await alert.present();
  }

  customPopoverOptions: any = {
    //header: 'Asistente'
  };
}
