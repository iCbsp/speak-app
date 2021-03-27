import { Component, OnInit } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite/ngx';

// Para conocer el dispositivo
import { Platform } from '@ionic/angular';

// Base de datos
import { DatabaseService } from 'src/app/services/databaseService';

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
    private databaseService:DatabaseService
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
          configuracion.modo_simple = 0;
          configuracion.respuesta = 0;
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
  }

  
  cambiaRespuesta(){
    this.respuestaActivada = !this.respuestaActivada;
    this.databaseService.cambiaRespuesta(this.respuestaActivada);
  }

}
