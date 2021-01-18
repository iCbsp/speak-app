import { Component, OnInit } from '@angular/core';

// Base de datos
import { DatabaseService } from 'src/app/services/databaseService';

// Router, para pasar parametros
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage implements OnInit {

  usuario : any;

  constructor(
    private databaseService:DatabaseService,
    private route: ActivatedRoute, // Para recibir los parametros del Router
  ) {
    let usuarioAEditar : number;

    // Recogida del usuario a editar
    this.route.params.subscribe(params => {
      usuarioAEditar = params['usuarioAEditar'];
      alert(usuarioAEditar);
    });

    // databaseService.lista.subscribe((ready)=>{
    //   if(ready){
    //     if(usuarioAEditar) databaseService.obtenUsuario(usuarioAEditar);
    //     else alert("No se ha recibido un usuario a editar");
    //   }
    // });
  }

  ngOnInit() {
  }

}
