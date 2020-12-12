import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

// TTS
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@Component({
  selector: 'app-reproduccion',
  templateUrl: './reproduccion.page.html',
  styleUrls: ['./reproduccion.page.scss'],
})
export class ReproduccionPage implements OnInit {
  
  textoAReproducir = "";

  constructor(
    private route: ActivatedRoute, // Para recibir los parametros del Router
    private tts: TextToSpeech, // TTS
    ) {

    this.route.params.subscribe(params => {
      this.textoAReproducir = params['textoAReproducir'];
      console.log(params['textoAReproducir']);
    });

    this.diElTextoTrasEsperar();
  }

  diElTextoTrasEsperar(){
    setTimeout(() => {
      this.diTTS()
    }, 1000);
  }

  // Metodos TTS
  async diTTS():Promise<any>{
    try{
      await this.tts.speak({
        text: this.textoAReproducir,
        locale: 'es-ES'
      });
      console.log("Successfully said " + this.textoAReproducir);
      //this.ventanaAccesibilidad();
    }
    catch(e){
      console.log(e);
    }
  }

  pararTTS(){
    console.log("parando TTS");

  }

  ngOnInit() {
  }

}
