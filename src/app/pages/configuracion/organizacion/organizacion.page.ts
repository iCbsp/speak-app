import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/databaseService';

@Component({
  selector: 'app-organizacion',
  templateUrl: './organizacion.page.html',
  styleUrls: ['./organizacion.page.scss'],
})
export class OrganizacionPage implements OnInit {

  configuracion = { modo_simple: 1, respuesta: 1, criterio_acciones: 'alfabetico', orden_acciones: 'ascendente' };
  guardado = true;

  constructor(
    private databaseService: DatabaseService,
    private platform: Platform
  ) { }

  ngOnInit() {
    if(!this.platform.is('desktop')){
      this.databaseService.lista.subscribe((ready)=>{
        if(ready){
          this.consigueConfiguracion();
        }
      });
      this.databaseService.cambio.subscribe(()=>{
        this.consigueConfiguracion();
      });
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

  guardar(){
    if(!this.guardado){
      this.databaseService.cambiaCriterioAcciones(this.configuracion.criterio_acciones).then(() => {
        this.databaseService.cambiaOrdenAcciones(this.configuracion.orden_acciones).then(() => {
          this.guardado = true;
        });
      });
    } else alert("Los cambios ya han sido guardados");
  }

  noGuardado(){
    this.guardado = false;
  }

}
