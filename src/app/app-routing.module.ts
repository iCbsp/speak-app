import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'configuracion',
    loadChildren: () => import('./pages/configuracion/configuracion.module').then( m => m.ConfiguracionPageModule)
  },
  {
    path: 'nosotros',
    loadChildren: () => import('./pages/nosotros/nosotros.module').then( m => m.NosotrosPageModule)
  },  {
    path: 'reproduccion',
    loadChildren: () => import('./pages/reproduccion/reproduccion.module').then( m => m.ReproduccionPageModule)
  },
  {
    path: 'usuario-popover',
    loadChildren: () => import('./components/usuario-popover/usuario-popover.module').then( m => m.UsuarioPopoverPageModule)
  },
  {
    path: 'accion-popover',
    loadChildren: () => import('./components/accion-popover/accion-popover.module').then( m => m.AccionPopoverPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
