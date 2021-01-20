import { Component, OnInit } from '@angular/core';

// Base de datos
import { DatabaseService } from 'src/app/services/databaseService';

// Para ir hacia atras
import { Location } from '@angular/common';

@Component({
  selector: 'app-crear-perfil',
  templateUrl: './crear-perfil.page.html',
  styleUrls: ['./crear-perfil.page.scss'],
})
export class CrearPerfilPage implements OnInit {

  nombre = "";
  color = "#000000";

  constructor(
    private databaseService:DatabaseService,
    private location: Location
  ) {
  }
  
  creaUsuario(){
    // Envio del usuario a la base de datos
    this.databaseService.lista.subscribe((ready)=>{
      if(ready){
        this.databaseService.publicaUsuario(this.nombre, this.color).then(() => {this.location.back();});
      }
    });
  }

  ngOnInit() {
  }

}
