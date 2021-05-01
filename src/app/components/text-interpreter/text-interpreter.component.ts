import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import * as data from '../../../assets/json/aspirantes_ES.json';

// Portapapeles
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Component({
  selector: 'app-text-interpreter',
  templateUrl: './text-interpreter.component.html',
  styleUrls: ['./text-interpreter.component.scss'],
})
export class TextInterpreterComponent implements OnInit {

  textoATratar: string = "";
  aspirantes: Array<string> = [];
  modoTexto: string = "ambos";
  palabras: Array<string>;
  emojis: Array<string>;

  @Input() set textoGetter(texto: string){
    this.textoATratar = texto;
    this.actualizaTexto();
  };

  constructor(
    private tts: TextToSpeech,
    private changeDetector: ChangeDetectorRef,
    private clipboard: Clipboard,
  ) { }

  ngOnInit() {}

  actualizaTexto(textoATratar?: string){
    if(textoATratar == undefined || textoATratar == "") textoATratar = this.textoATratar;
    
    if(textoATratar != "") {
      this.palabras = textoATratar.split(" ");
      this.emojis = new Array<string>(this.palabras.length);
      this.emojis.fill("");
      for(var palabra in this.palabras){
        for(var aspirante in data.aspirantes){
          if(data.aspirantes[aspirante].texto.toLowerCase() == this.palabras[palabra].toLowerCase()){
            this.emojis[palabra] = data.aspirantes[aspirante].emoji;
          }
        }
      }
    }
  }

  respuestaAPortapapeles(){
    this.clipboard.copy(this.textoATratar);
  }

  onModoTextoChange(){
    this.changeDetector.detectChanges();
  }

  // Metodos TTS
  async diTTS(texto: string):Promise<any>{
    try{
      await this.tts.speak({
        text: texto,
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
