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
import { ChangeDetectorRef } from '@angular/core'; // Si no se usa no actualiza el input

// Base de datos
import { DatabaseService } from '../services/databaseService';

// Para detectar cambios en la URL
import { Location } from '@angular/common';

// Popover
import { PopoverController } from '@ionic/angular';
import { UsuarioPopoverPage } from 'src/app/components/usuario-popover/usuario-popover.page';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  //asistente: string;
  asistente = "Alexa"; // cambiar si hay persistencia

  preguntadaAccesibilidad = true;
  preguntadoUsoDeDatos = true;

  // Var STT
  coincidencias: String[];
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
    private platform: Platform, private speechRecognition: SpeechRecognition, private changeDetector: ChangeDetectorRef, // Si el STT no va: public navCtrl: NavController
    private databaseService:DatabaseService,
    private location: Location,
    private popover:PopoverController
  ){
    if(!this.preguntadoUsoDeDatos) this.ventanaPoliticas();
    if(!this.preguntadaAccesibilidad) this.ventanaAccesibilidad();

    if(!platform.is('desktop')){
      databaseService.lista.subscribe((ready)=>{
        if(ready){
          this.consigueUsuarios();
          this.consigueAsistentes();
          
          this.location.onUrlChange((url) => {
            if(url.toString() == "/tabs/tab1" || url.toString() == "/tabs/tab2" || url.toString() == "/tabs/tab3") {
              this.consigueUsuarios();
              this.consigueAsistentes();
            }
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
          // No entra aqui si 
          this.databaseService.obtenAsistenteDeUsuario(this.usuarioSeleccionado.id)
            .then((asistente) => {
              if(asistente) {
                // this.asistenteSeleccionado = String(asistente.id);
                this.asistenteSeleccionado = asistente.id;
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

  iniciaSTT(){
    let options = {
      // language: 'en-US'
      language: 'es-ES'
    }
    this.speechRecognition.startListening().subscribe(coincidencias => {
      this.coincidencias = coincidencias;
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
    // Comprobación asistente
    var textoAsistente = "";
    if(this.asistente != "Ninguno") textoAsistente = this.asistente + ", ";

    const alert = await this.alertController.create({
      cssClass: 'ventanaTextoManual',
      header: 'Acción manual',
      inputs: [
        {
          name: 'textoSTT',
          type: 'text',
          //placeholder: 'Acción a realizar',
          value: textoAsistente
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
          text: 'Enviar',
          role: 'enviar',
          handler: data => {
            console.log('Confirm Ok');
            //this.texto =  data.textoSTT;
            //this.diTTS();
            this.router.navigate(['reproduccion', {textoAReproducir: data.textoSTT}]);
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
