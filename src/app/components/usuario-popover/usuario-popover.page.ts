import { Component, OnInit } from '@angular/core';

// Popover
import { PopoverController } from '@ionic/angular';

// Base de datos
import { DatabaseService } from 'src/app/services/databaseService';

// Router, para pasar parametros
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-usuario-popover',
  templateUrl: './usuario-popover.page.html',
  styleUrls: ['./usuario-popover.page.scss'],
})
export class UsuarioPopoverPage implements OnInit {

  usuarios = [];

  constructor(
    private popover:PopoverController,
    private databaseService:DatabaseService,
    private router: Router, // Para pasar parametros
    private route: ActivatedRoute
  ) {
    this.consigueUsuarios();

    // this.location.onUrlChange((url) => {
    //   if(url.toString() == "/configuracion/perfiles") this.consigueUsuarios();
    // });
  }

  consigueUsuarios(){
    this.databaseService.lista.subscribe((ready)=>{
      if(ready){
        this.databaseService.obtenUsuariosSesion().then((usuariosBDD)=>{
          this.usuarios = [];
          for(let i = 0; i < usuariosBDD.length; i++)
            this.usuarios.push(usuariosBDD.item(i));
          // this.changeDetector.detectChanges(); // Para actualizar la vista
        });
      }
    });
  }
  
  cambiaUsuario(usuarioID : number){
    this.databaseService.cambiaUsuarioActual(usuarioID);
    // window.location.reload();
    this.popover.dismiss();
  }

  closePopover(){
    this.popover.dismiss();
  }

  ngOnInit() {}

}
