import { Component, OnInit } from '@angular/core';

// Base de datos
import { DatabaseService } from 'src/app/services/databaseService';

// Router, para pasar parametros
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.page.html',
  styleUrls: ['./perfiles.page.scss'],
})
export class PerfilesPage implements OnInit {

  usuarios = [];

  constructor(
    private databaseService:DatabaseService,
    private router: Router, // Para pasar parametros
    private route: ActivatedRoute
  ) {
    databaseService.lista.subscribe((ready)=>{
      if(ready){
        databaseService.obtenUsuarios().then((usuariosBDD)=>{
          for(let i = 0; i < usuariosBDD.length; i++)
            this.usuarios.push(usuariosBDD.item(i));
        });
      }
    });
  }

  veAlPerfil(usuarioID : number){
    try{
      this.router.navigate(['editar-perfil', {
        usuarioAEditar: usuarioID
      }], { relativeTo: this.route });
    }
    catch(e){
      console.log(e);
    }
  }

  ngOnInit() {
  }

}
