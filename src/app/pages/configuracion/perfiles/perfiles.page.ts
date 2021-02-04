import { Component, OnInit } from '@angular/core';

// Base de datos
import { DatabaseService } from 'src/app/services/databaseService';

// Router, para pasar parametros
import { Router, ActivatedRoute } from '@angular/router';

// Para detectar cambios en la URL
import { Location } from '@angular/common';

// Para actualizar el HTML
import { ChangeDetectorRef } from '@angular/core';

// Alertas - Prompt
import { AlertController } from '@ionic/angular';

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
    private changeDetector: ChangeDetectorRef,
    public alertController: AlertController, // Alertas - Prompt
  ) {
    this.consigueUsuarios();

    // this.location.onUrlChange((url) => {
    //   if(url.toString() == "/configuracion/perfiles") this.consigueUsuarios();
    // });
    databaseService.cambio.subscribe(()=>{
      this.consigueUsuarios();
    });
  }

  consigueUsuarios(){
    this.databaseService.lista.subscribe((ready)=>{
      if(ready){
        this.databaseService.obtenUsuariosAlfabeticamente().then((usuariosBDD)=>{
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

  preguntaBorraUsuario(usuarioID : number){
    this.databaseService.obtenUsuariosSesion().then((usuariosBDD)=>{
      if(usuariosBDD.length > 1){
        this.ventanaBorraUsuario(usuarioID);
      } else alert("Para eliminarlo es necesario que haya más de un perfil");
    });
  }

  async ventanaBorraUsuario(usuarioID : number) {
    let usuario : any;
    await this.databaseService.obtenUsuario(usuarioID).then((usuarioBDD)=>{
      if(usuarioBDD) usuario = usuarioBDD;
    });

    const alert = await this.alertController.create({
      cssClass: 'ventanaBorraUsuario',
      header: 'Borrar usuario (' + usuario.nombre + ')',
      message: '¿Seguro que quieres borrar este perfil y por tanto las acciones y preferencias asociadas a él?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancelar',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, 
        {
          text: 'Confirmar',
          role: 'confirmar',
          handler: () => {
            console.log('Confirm Ok');
            this.databaseService.borraUsuario(usuarioID).then(() => {
              //window.location.reload();
              this.consigueUsuarios();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnInit() {
  }

}
