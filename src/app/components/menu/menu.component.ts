import { Component, OnInit } from '@angular/core';

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
        let configuracion = databaseService.obtenConfiguracion(1);
        alert("Despues de obtenConfiguracion");
        // if(configuracion) alert("Modo_Simple: " + configuracion.modo_simple);
        // else alert("Modo_Simple: Nada");
        alert("Modo_Simple: " + configuracion.modo_simple);
      }
    });
  }

  
  cambiaModoSimple(){
    this.modoSimpleActivado = !this.modoSimpleActivado;
  }

  STTActivado = false;
  
  cambiaSTT(){
    this.STTActivado = !this.STTActivado;
  }

  ngOnInit() {}

}
