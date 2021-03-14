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
  selector: 'app-crear-accion-popover',
  templateUrl: './crear-accion-popover.page.html',
  styleUrls: ['./crear-accion-popover.page.scss'],
})
export class CrearAccionPopoverPage implements OnInit {
  
  constructor(
    private changeDetector: ChangeDetectorRef,
    private popover:PopoverController,
    private router: Router, // Para pasar parametros
    private platform: Platform, 
    private databaseService:DatabaseService
    ) {
  }
  
  ngOnInit() {
  }

  closePopover(){
    this.popover.dismiss();
  }
}
