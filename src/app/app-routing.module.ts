import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* pages */
import { AuthComponent } from './auth/auth/auth.component';
import { authGuard } from './auth/auth/authGuard/authGuard';

import { NavbarComponent } from './navbar/navbar.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { codeGuard } from './auth/reset-password/change-password/codeGuard/codeGuard';
import { ChangePasswordComponent } from './auth/reset-password/change-password/change-password.component';
import { RoleGuard } from './services/auth/role.guard';

const routes: Routes = [

  /* ruta de la pagina de inicio */
  {path:'', redirectTo:'/mobentis/dashboard/global', pathMatch:'full'},
  
  {path: 'login', component: AuthComponent},
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'reset-password/:code', component: ChangePasswordComponent,
    canMatch: [codeGuard],
  },
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
        canActivate: [authGuard, RoleGuard],
        canMatch: [authGuard],
        data: { 
          roles: ['Admin', 'Editor'],
          permissions: ['VISUALIZADO_CONFIGURACION']
        }

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
