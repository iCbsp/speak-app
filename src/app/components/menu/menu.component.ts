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
  
  constructor(
    private plt: Platform,
    private databaseService:DatabaseService
  ) {
    databaseService.lista.subscribe((ready)=>{
      if(ready){
        // Investigar algo que lo haga esperar, el tutorial original tenia el boolean
        alert("Antes de obtenConfiguracion");
        let respuesta = databaseService.obtenConfiguracion(1);
        alert("Despues de obtenConfiguracion");
        // if(configuracion) alert("Modo_Simple: " + configuracion.modo_simple);
        // else alert("Modo_Simple: Nada");
        respuesta.then((configuracion)=>{
          if(configuracion.modo_simple) this.modoSimpleActivado = true;
          else this.modoSimpleActivado = false;
          alert("Modo simple: " + this.modoSimpleActivado);
        });
      }
    });
  }

  
  cambiaModoSimple(){
    this.modoSimpleActivado = !this.modoSimpleActivado;
    this.databaseService.cambiaModoSimple(this.modoSimpleActivado);
  }

  STTActivado = false;
  
  cambiaSTT(){
    this.STTActivado = !this.STTActivado;
  }

  ngOnInit() {}

}
