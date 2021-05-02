import { Component, OnInit } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite/ngx';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

// Para conocer el dispositivo
import { MenuController, Platform } from '@ionic/angular';

// Base de datos
import { DatabaseService } from 'src/app/services/databaseService';
import { EmojiStringComponent } from '../emoji-string/emoji-string.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  modoSimpleActivado = false;
  respuestaActivada = false;
  
  constructor(
    private plt: Platform,
    private databaseService:DatabaseService,
    private menuController: MenuController,
    private tts: TextToSpeech,
    private emojiString: EmojiStringComponent
  ) {}

  ngOnInit() {
    this.obtenConfiguracion();
    this.databaseService.cambio.subscribe(()=>{
      this.obtenConfiguracion();
    });
  }

  obtenConfiguracion(){
    this.databaseService.lista.subscribe((ready)=>{
      if(ready){
        this.databaseService.obtenConfiguracion().then((configuracion)=>{
          this.modoSimpleActivado = false;
          this.respuestaActivada = false;
          if(configuracion.modo_simple) this.modoSimpleActivado = true;
          if(configuracion.respuesta) this.respuestaActivada = true;
        });
      }
    });
  }

  public getRespuesta(){
    return this.respuestaActivada;
  }
  
  cambiaModoSimple(){
    this.modoSimpleActivado = !this.modoSimpleActivado;
    this.databaseService.cambiaModoSimple(this.modoSimpleActivado);
    if(this.modoSimpleActivado) {
      this.diTTS('Modo simple activado');
      this.menuController.close();
    } else {
      this.diTTS('Modo simple desactivado');
      this.menuController.close();
    }
  }

  
  cambiaRespuesta(){
    this.respuestaActivada = !this.respuestaActivada;
    if(this.modoSimpleActivado){
      if(this.respuestaActivada) this.diTTS('Respuesta activada');
      else this.diTTS('Respuesta desactivada');
    }
    this.databaseService.cambiaRespuesta(this.respuestaActivada);
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
