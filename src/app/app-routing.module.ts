import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* pages */
import { AuthComponent } from './auth/auth/auth.component';
import { PagesComponent } from './sidenav/sidenav.component';
import { authGuard } from './auth/auth/authGuard/authGuard';

const routes: Routes = [

  /* ruta de la pagina de inicio */
  {path:'', redirectTo:'/mobentisrechazos/dashboard/global', pathMatch:'full'},
  
  {path: 'login', component: AuthComponent},
  
  /* Rutas de todo el proyecto */
  {
    path: 'mobentisrechazos', component: PagesComponent, 
    children:[
      /* ejemplo */
      /* {
        path: 'clientes',
        loadChildren: () => import('./clients/clients.module').then(m => m.ClientsModule),
        canActivate: [authGuard],
        canMatch: [authGuard]
      }, */
      {
        path: 'rechazos',
        loadChildren: () => import('./rechazos/rechazos.module').then(m => m.RechazosModule),
        canActivate: [authGuard],
        canMatch: [authGuard]

      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DahsboardModule),
        canActivate: [authGuard],
        canMatch: [authGuard]

      },
      {
        path: 'clientes',
        loadChildren: () => import('./clients/clients.module').then(m => m.ClientsModule),
        canActivate: [authGuard],
        canMatch: [authGuard]

      },
      {
        path: 'configuracion',
        loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule),
        canActivate: [authGuard],
        canMatch: [authGuard]

      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
