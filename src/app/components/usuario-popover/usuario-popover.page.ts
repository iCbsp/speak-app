import { Component, OnInit } from '@angular/core';

// Popover
import { PopoverController } from '@ionic/angular';

// Base de datos
import { DatabaseService } from 'src/app/services/databaseService';

// Router, para pasar parametros
import { Router, ActivatedRoute } from '@angular/router';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { EmojiStringComponent } from '../emoji-string/emoji-string.component';

@Component({
  selector: 'app-usuario-popover',
  templateUrl: './usuario-popover.page.html',
  styleUrls: ['./usuario-popover.page.scss'],
})
export class UsuarioPopoverPage implements OnInit {

  usuarios = [];
  configuracion = { modo_simple: 1 };

  constructor(
    private popover:PopoverController,
    private databaseService:DatabaseService,
    private router: Router, // Para pasar parametros
    private tts: TextToSpeech, // TTS
    private emojiString: EmojiStringComponent,
    private route: ActivatedRoute
  ) {
  }
  
  ngOnInit() {
    this.consigueUsuarios();
    this.consigueConfiguracion();
  }

  consigueUsuarios(){
    this.databaseService.lista.subscribe((ready)=>{
      if(ready){
        this.databaseService.obtenUsuariosSesion().then((usuariosBDD)=>{
          this.usuarios = [];
          for(let i = 0; i < usuariosBDD.length; i++)
            this.usuarios.push(usuariosBDD.item(i));
          // this.changeDetector.detectChanges(); // Para actualizar la vista
        });
      }
    });
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

  cambiaUsuario(usuarioID : number){
    this.databaseService.cambiaUsuarioActual(usuarioID);
    // window.location.reload();
    this.popover.dismiss();
  }

  closePopover(){
    this.popover.dismiss();
  }
  
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

  async pararTTS(){
    try{
      await this.tts.speak("");
    }
    catch(e){
      if(e == "cordova_not_available") console.log(e);
      else alert("pararTTS: Ha surgido un error relacionado con el Text To Speech");
    }
  }
}
