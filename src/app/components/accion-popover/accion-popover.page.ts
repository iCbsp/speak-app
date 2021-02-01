import { Component, OnInit } from '@angular/core';

// Popover
import { PopoverController } from '@ionic/angular';

// Base de datos
import { DatabaseService } from 'src/app/services/databaseService';

// Actualizar vista
import { ChangeDetectorRef } from '@angular/core';

// Para saber si es iOS
import { Platform } from '@ionic/angular';

// Router, para pasar parametros
import { Router } from '@angular/router';

@Component({
  selector: 'app-accion-popover',
  templateUrl: './accion-popover.page.html',
  styleUrls: ['./accion-popover.page.scss'],
})
export class AccionPopoverPage implements OnInit {
  
  accion = { id: 0, titulo: "Error en la acción" };
  filas = [];
  asistenteInicial = "";
  asistenteFinal = "";
  
  constructor(
    private changeDetector: ChangeDetectorRef,
    private popover:PopoverController,
    private router: Router, // Para pasar parametros
    private platform: Platform, 
    private databaseService:DatabaseService
    ) {
    }
  
    ngOnInit() {
      if(!this.platform.is('desktop')){
        this.databaseService.lista.subscribe((ready)=>{
          if(ready){
            if(!this.accion.id) alert("No se ha recibido el id de la accion");

            // Filas
            this.databaseService.obtenFilas(this.accion.id).then((filasBDD) => {
              this.filas = [];
              if(filasBDD) {
                for(let i = 0; i < filasBDD.length; i++)
                  this.filas.push(filasBDD.item(i));

                // Asistentes
                this.databaseService.obtenAsistenteDeUsuario().then((asistente) => {
                  if(asistente != null){
                    this.asistenteInicial = asistente.inicial;
                    this.asistenteFinal = asistente.final;
                  }
                });

                this.changeDetector.detectChanges();
              }
            });
          }
        });
      }
    }
    
    closePopover(){
      this.popover.dismiss();
    }
    
    deTipoFilaABoolean(tipo : number){
      if(tipo == 1) return true;
    return false;
  }

  reproducirTexto(){
    this.closePopover();
      
    let texto = "";
    if(this.asistenteInicial) texto += this.asistenteInicial + ", ";
    for(let i = 0; i < this.filas.length; i++)
      texto += " " + this.filas[i].texto;
    if(this.asistenteFinal) texto += " " + this.asistenteFinal;

    this.router.navigate(['reproduccion', {
        textoAReproducir: texto,
        STTActivado: true // Cambiar
      }
    ]);
  }
}
