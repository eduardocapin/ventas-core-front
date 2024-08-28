import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* pages */
import { AuthComponent } from './auth/auth/auth.component';
import { authGuard } from './auth/auth/authGuard/authGuard';

import { NavbarComponent } from './navbar/navbar.component';

const routes: Routes = [

  /* ruta de la pagina de inicio */
  {path:'', redirectTo:'/mobentis/dashboard/global', pathMatch:'full'},
  
  {path: 'login', component: AuthComponent},
  
  /* Rutas de todo el proyecto */
  {
    path: 'mobentis', component: NavbarComponent, 
    children:[
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

      },
      {
        path: 'import',
        loadChildren: () => import('./import/import.module').then(m => m.ImportModule),
        canActivate: [authGuard],
        canMatch: [authGuard]
      }
    ]
  },
  {path:'**', redirectTo:'/login',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
