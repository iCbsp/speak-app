import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accesibilidad',
  templateUrl: './accesibilidad.page.html',
  styleUrls: ['./accesibilidad.page.scss'],
})
export class AccesibilidadPage implements OnInit {

  // Variables configuración accesibilidad
  iconos = 100;
  letra = 12;
  modoAltoContrasteActivado = false;
  constructor() { }

  cambioAltoContraste(){
    this.modoAltoContrasteActivado = !this.modoAltoContrasteActivado;
  }

  ngOnInit() {
  }

}
