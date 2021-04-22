import { Component, OnInit } from '@angular/core';

// Popover
import { PopoverController } from '@ionic/angular';

// Alertas - Prompt
import { AlertController } from '@ionic/angular';

// Base de datos
import { DatabaseService } from 'src/app/services/databaseService';

// Actualizar vista
import { ChangeDetectorRef } from '@angular/core';

// Para saber si es iOS
import { Platform } from '@ionic/angular';

// Router, para pasar parametros
import { Router } from '@angular/router';

import { ModoAccion, TiposAcciones, TiposFilas } from 'src/app/enumerations';
import { FilaAccion, SugerenciaFila } from 'src/app/structures';
import { EmojiStringComponent } from '../emoji-string/emoji-string.component';

@Component({
  selector: 'app-accion-popover',
  templateUrl: './accion-popover.page.html',
  styleUrls: ['./accion-popover.page.scss'],
})
export class AccionPopoverPage implements OnInit {
  
  modoAccion = ModoAccion.ver;
  accion = { id: 0, titulo: "Error en la acción", imagen: "", tipo: TiposAcciones.tab1 };
  filas = new Array<FilaAccion>();
  filaId = 0;
  asistente = { inicial: "", final: ""};
  configuracion = { modo_simple: 1, respuesta: 1 };
  cargando = false;
  
  constructor(
    private changeDetector: ChangeDetectorRef,
    private popover:PopoverController,
    private router: Router, // Para pasar parametros
    private platform: Platform,
    public alertController: AlertController, // Alertas - Prompt
    private databaseService:DatabaseService,
    private emojiString: EmojiStringComponent
    ) {
    }
  
    ngOnInit() {
      if(!this.platform.is('desktop')){
        if(this.modoAccion == ModoAccion.ver || this.modoAccion == ModoAccion.editar){
          this.cargando = true;
          this.databaseService.lista.subscribe((ready)=>{
            if(ready){
              if(!this.accion.id) alert("No se ha recibido el id de la accion");
  
              // Accion
              this.databaseService.obtenInfoAccion(this.accion.id).then((accionBDD) => {
                if(accionBDD) this.accion = accionBDD;
              });

              // Filas
              this.databaseService.obtenFilas(this.accion.id).then((filasBDD) => {
                this.filas = [];
                if(filasBDD) {
                  for(let fila = 0; fila < filasBDD.length; fila++)
                    this.filas.push(filasBDD.item(fila));

                  for(let fila = 0; fila < this.filas.length; fila++){
                    this.databaseService.obtenSugerencias(this.filas[fila].id).then(sugerenciasBDD => {
                      let sugerencias = new Array<SugerenciaFila>();
                      if(sugerenciasBDD){
                        // Pone como valor la primera sugerencia
                        if(sugerenciasBDD.length > 0 && this.filas[fila].tipo == TiposFilas.temporal) this.filas[fila].texto = sugerenciasBDD.item(0).texto;

                        for(let sugerencia = 0; sugerencia < sugerenciasBDD.length; sugerencia++)
                          sugerencias.push(sugerenciasBDD.item(sugerencia));
                      }
                      this.filas[fila].sugerencias = sugerencias;
                      });
                  };
                  
                  if(this.modoAccion == ModoAccion.ver){
                    // Asistentes
                    this.databaseService.obtenAsistenteDeUsuario().then((asistenteBDD) => {
                      if(asistenteBDD != null){
                        this.asistente = asistenteBDD;
                      }
                      this.consigueConfiguracion().then(() => this.cargando = false);
                      this.changeDetector.detectChanges();
                    });
                  } else this.cargando = false;
                }
              });
            }
          });
        } else if(this.modoAccion == ModoAccion.crear){
          this.accion.titulo = "";
          this.accion.imagen = "😃";
          this.filaId = 0;
          this.filas = new Array();
          this.filas.push(new FilaAccion(this.filaId++, "", TiposFilas.fija));
          this.filas.push(new FilaAccion(this.filaId++, "", TiposFilas.temporal));
        }
      }
    }
    
  closePopover(){
    this.popover.dismiss();
  }
    
  cambiaAModoVer(){
    this.modoAccion = ModoAccion.ver;
    this.ngOnInit();
  }

  deTipoFilaABoolean(tipo : number){
    if(tipo == 1) return true;
    else return false;
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

  reproducirTexto(){

    this.filas.forEach(fila => {
      if(fila.tipo == TiposFilas.temporal && fila.texto != ""){
        let diferente = true;
        if(fila.sugerencias && fila.sugerencias.length){
          fila.sugerencias.forEach(sugerencia => {
            if(sugerencia.texto == fila.texto) {
              diferente = false;
              this.databaseService.actualizaFechaUltimoUsoSugerenciaTextoFila(sugerencia.texto, fila.id);
            }
          });
        }
        if(diferente) this.databaseService.publicaSugerencia(fila.id, fila.texto);
      }
    });

    this.databaseService.actualizaFechaUltimoUsoAccion(this.accion.id);

    this.closePopover();
      
    let texto = "";
    if(this.asistente.inicial) texto += this.asistente.inicial + ", ";
    for(let i = 0; i < this.filas.length; i++)
      texto += " " + this.filas[i].texto;
    if(this.asistente.final) texto += " " + this.asistente.final;
    this.router.navigate(['reproduccion', {
        textoAReproducir: texto,
        respuesta: this.configuracion.respuesta,
        modo_simple: this.configuracion.modo_simple
      }
    ]);
  }

  async ventanaBorrarAccion(){
    const ventanaConfirmacionBorrarAccion = await this.alertController.create({
      cssClass: 'ventanaConfirmacionBorrarAccion',
      header: 'Borrar acciones',
      message: '¿Seguro que quiere borrar las siguientes acciones?<br><br>' + this.accion.titulo,
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
            this.databaseService.borraAcciones([this.accion.id]).then(() => {
              this.closePopover();
            });
          }
        }
      ]
    });

    await ventanaConfirmacionBorrarAccion.present();
  }

  /*
  *
  * Metodos de crear accion
  * 
  */
  mueveFilaArriba(id: number){
    for(let fila = 0; fila < this.filas.length; fila++){
      if(this.filas[fila].id == id && fila > 0){
        [this.filas[fila-1], this.filas[fila]] = [this.filas[fila], this.filas[fila-1]];
        break;
      }
    }
    this.changeDetector.detectChanges();
  }

  mueveFilaAbajo(id: number){
    for(let fila = 0; fila < this.filas.length; fila++){
      if(this.filas[fila].id == id && fila < this.filas.length-1){
        [this.filas[fila+1], this.filas[fila]] = [this.filas[fila], this.filas[fila+1]];
        break;
      }
    }
    this.changeDetector.detectChanges();
  }

  creaFila(tipo: string){
    if(tipo == 't') this.filas.push(new FilaAccion(this.filaId++, "", TiposFilas.temporal));
    else if(tipo == 'f') this.filas.push(new FilaAccion(this.filaId++, "", TiposFilas.fija));
  }

  borraFila(id: number){
    for(let fila = 0; fila < this.filas.length; fila++){
      if(this.filas[fila].id == id) this.filas.splice(fila, 1);
    }
  }

  creaAccion(){
    if(this.filas && this.filas.length){
      this.databaseService.publicaAccion(this.accion.tipo, this.accion.titulo, this.accion.imagen, undefined, this.filas).then(() => {
        this.closePopover();
      });
    } else alert("Para crear una acción es necesario que haya al menos una fila");
  }
  
  colorDependiendoDelTipo(tipo: TiposFilas){
    if(tipo == TiposFilas.fija) return "#808080";
    else if(tipo == TiposFilas.temporal) return "#000000";
  }
  
  /*
  *
  * Metodos de editar accion
  * 
  */
  cambiaAModoEditar(){
    this.modoAccion = ModoAccion.editar;
    this.ngOnInit();
  }

  editaAccion(){
    if(this.filas && this.filas.length){
      this.databaseService.editaAccion(this.accion.id, this.filas, this.accion.titulo, this.accion.imagen).then(() => {
        // this.closePopover();
        this.modoAccion = ModoAccion.ver;
        this.ngOnInit();
      });
    } else alert("Para guardar una acción es necesario que haya al menos una fila");
  }
}
