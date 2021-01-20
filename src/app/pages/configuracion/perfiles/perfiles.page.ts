import { Component, OnInit } from '@angular/core';

// Base de datos
import { DatabaseService } from 'src/app/services/databaseService';

// Router, para pasar parametros
import { Router, ActivatedRoute } from '@angular/router';

// Para detectar cambios en la URL
import { Location } from '@angular/common';

// Para actualizar el HTML
import { ChangeDetectorRef } from '@angular/core';

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
    private route: ActivatedRoute,
    private location: Location,
    private changeDetector: ChangeDetectorRef
  ) {
    this.consigueUsuarios();

    this.location.onUrlChange((url) => {
      if(url.toString() == "/configuracion/perfiles") this.consigueUsuarios();
    });
  }

  consigueUsuarios(){
    this.databaseService.lista.subscribe((ready)=>{
      if(ready){
        this.databaseService.obtenUsuarios().then((usuariosBDD)=>{
          this.usuarios = [];
          for(let i = 0; i < usuariosBDD.length; i++)
            this.usuarios.push(usuariosBDD.item(i));
          this.changeDetector.detectChanges(); // Para actualizar la vista
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
