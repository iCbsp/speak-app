import { Component, OnInit } from '@angular/core';

// Base de datos
import { DatabaseService } from 'src/app/services/databaseService';

// Para recibir los parametros
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage implements OnInit {

  usuario = {nombre: "Usuario no encontrado"};

  constructor(
    private databaseService:DatabaseService,
    private route: ActivatedRoute, // Para recibir los parametros del Router
  ) {
    let usuarioAEditar : number;

    // Recogida del usuario a editar
    this.route.params.subscribe(params => {
      usuarioAEditar = params['usuarioAEditar'];
      databaseService.lista.subscribe((ready)=>{
        if(ready){
          if(usuarioAEditar){
            databaseService.obtenUsuario(usuarioAEditar).then((usuarioBDD)=>{
              if(usuarioBDD) this.usuario = usuarioBDD;
            });
          } else alert("No se ha recibido un usuario a editar");
        }
      });
    });

  }

  ngOnInit() {
  }

}
