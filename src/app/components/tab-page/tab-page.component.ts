import { Component, Input, OnInit } from '@angular/core';

// Alertas - Prompt
import { AlertController } from '@ionic/angular';

// Base de datos
import { DatabaseService } from 'src/app/services/databaseService';

// Para saber si es iOS
import { Platform } from '@ionic/angular';

// Para actualizar la vista
import { ChangeDetectorRef } from '@angular/core';

// Popovers
import { PopoverController } from '@ionic/angular';
import { AccionPopoverPage } from 'src/app/components/accion-popover/accion-popover.page';

import { ModoAccion, TiposAcciones } from 'src/app/enumerations';

@Component({
  selector: 'app-tab-page',
  templateUrl: './tab-page.component.html',
  styleUrls: ['./tab-page.component.scss'],
})
export class TabPageComponent implements OnInit {

  @Input('tab') tab: TiposAcciones;

  acciones = [];
  idAccionesSeleccionadas = [];
  modoGrupo = false;
  configuracion = { modo_simple: 1, respuesta: 1, criterio_acciones: 'alfabetico', orden_acciones: 'descendiente' };

  constructor(
    public alertController: AlertController, // Alertas - Prompt
    private databaseService:DatabaseService,
    private platform: Platform,
    private changeDetector: ChangeDetectorRef,
    private popover:PopoverController
  ){}

  
  ngOnInit() {
    if(!this.platform.is('desktop')){
      this.databaseService.lista.subscribe((ready)=>{
        if(ready){
          this.consigueConfiguracion().then(() => this.consigueAcciones());
        }
      });
      this.databaseService.cambio.subscribe(()=>{
        this.consigueConfiguracion().then(() => this.consigueAcciones());
      });
    }
  }
  
  consigueAcciones(){
    this.databaseService.obtenAcciones(this.tab, undefined, this.configuracion.criterio_acciones, this.configuracion.orden_acciones).then((accionesBDD) => {
      this.acciones = [];
      if(accionesBDD) {
        for(let i = 0; i < accionesBDD.length; i++)
          this.acciones.push(accionesBDD.item(i));
      }
      this.changeDetector.detectChanges();
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
  
  crearAccionPopover(){
    if(!this.platform.is('desktop')){
      this.popover.create({
      component:AccionPopoverPage,
      cssClass: 'accionPopover',
      componentProps: {
        modoAccion: ModoAccion.crear,
        accion: { tipo: this.tab }
      },
      showBackdrop: true
      }).then((popoverElement)=>{
        popoverElement.present();
      })
    }
  }

  async abrirAccionPopover(accionSeleccionada){
    if(!this.modoGrupo){
      if(!this.platform.is('desktop') && accionSeleccionada){
        const popover = await this.popover.create({
        component:AccionPopoverPage,
        cssClass: 'accionPopover',
        componentProps: {
          accion: accionSeleccionada,
          modoAccion: ModoAccion.ver
        },
        showBackdrop: true
        });

        popover.onDidDismiss().then((result) => {
          //alert(result.data);
        });
        
        return await popover.present();
      } else alert("La función no es compatible con este dispositivo");
    } else {
      let estabaSeleccioada = false;
      for(let accion = 0; accion < this.idAccionesSeleccionadas.length; accion++){
        if(this.idAccionesSeleccionadas[accion] == accionSeleccionada.id){
          this.idAccionesSeleccionadas.splice(accion, 1);
          estabaSeleccioada = true;
          break;
        }
      }
      if(!estabaSeleccioada) this.idAccionesSeleccionadas.push(accionSeleccionada.id);
    }
  }

  obtenIndiceSeleccionada(accionPreguntada){
    for(let indiceAccion = 0; indiceAccion < this.idAccionesSeleccionadas.length; indiceAccion++){
      if(accionPreguntada.id == this.idAccionesSeleccionadas[indiceAccion]) return (indiceAccion + 1);
    }
  }

  async borrarAccionesSeleccionadas(){
    let accionesABorrar = "";

    if(this.idAccionesSeleccionadas.length){
      for(let indiceAccionesSeleccionadas = 0; indiceAccionesSeleccionadas < this.idAccionesSeleccionadas.length; indiceAccionesSeleccionadas++){
        for(let indiceAcciones = 0; indiceAcciones < this.acciones.length; indiceAcciones++){
          if(this.acciones[indiceAcciones].id == this.idAccionesSeleccionadas[indiceAccionesSeleccionadas]) accionesABorrar += "<br>'" + this.acciones[indiceAcciones].titulo + "'";
        }
      }
    } else {
      alert("Debe de seleccionar al menos una acción");
      return;
    }

    const ventanaConfirmacionBorrarAccion = await this.alertController.create({
      cssClass: 'ventanaConfirmacionBorrarAccion',
      header: 'Borrar acciones',
      message: '¿Seguro que quiere borrar las siguientes acciones?<br>' + accionesABorrar,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancelar',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirmar',
          role: 'confirmar',
          handler: () => {
            console.log('Confirm Ok');
            this.databaseService.borraAcciones(this.idAccionesSeleccionadas).then(() => {
              this.idAccionesSeleccionadas = new Array();
            });
          }
        }
      ]
    });

    await ventanaConfirmacionBorrarAccion.present();
  }

  conmutarModoGrupo(){
    this.modoGrupo = !this.modoGrupo;
    this.idAccionesSeleccionadas = new Array();
  }

  reproducirAccionesSeleccionadas(){
    alert("Función en desarrollo 🚧. Servirá para reproducir varias acciones en cadena");
  }

}
