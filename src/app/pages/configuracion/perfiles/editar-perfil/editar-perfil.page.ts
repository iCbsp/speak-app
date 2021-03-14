import { Component, OnInit } from '@angular/core';

// Base de datos
import { DatabaseService } from 'src/app/services/databaseService';

// Para recibir los parametros
import { ActivatedRoute } from '@angular/router';

// Para ir hacia atras
import { Location } from '@angular/common';

// Para actualizar el HTML
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage implements OnInit {

  usuario = { id: 0, nombre: "Usuario no encontrado", color: "#FFFFFF"};

  constructor(
    private databaseService:DatabaseService,
    private route: ActivatedRoute, // Para recibir los parametros del Router
    private location: Location,
    private changeDetector: ChangeDetectorRef,
  ) {
    
    // Recogida del usuario a editar
    this.route.params.subscribe(params => {
      let usuarioAEditar = params['usuarioAEditar'];
      databaseService.lista.subscribe((ready)=>{
        if(ready){
          if(usuarioAEditar){
            databaseService.obtenUsuario(usuarioAEditar).then((usuarioBDD)=>{
              if(usuarioBDD) this.usuario = usuarioBDD;
              changeDetector.detectChanges();
            });
          } else alert("No se ha recibido un usuario a editar");
        }
      });
    });
  }

  editaUsuario(){
    if(this.usuario.id && this.usuario.nombre && this.usuario.color){
      this.databaseService.lista.subscribe((ready)=>{
        if(ready){
          this.databaseService.editaUsuario(this.usuario.id, this.usuario.nombre, this.usuario.color).then(() => {this.location.back();});
        }
      });
    } else alert("Usuario no válido");
  }

  ngOnInit() {
  }

}
