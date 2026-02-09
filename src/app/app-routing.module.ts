import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/* pages */
import { AuthComponent } from './auth/auth/auth.component';
import { authGuard } from './auth/auth/authGuard/authGuard';

import { NavbarComponent } from './navbar/navbar.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { codeGuard } from './auth/reset-password/change-password/codeGuard/codeGuard';
import { ChangePasswordComponent } from './auth/reset-password/change-password/change-password.component';
import { RoleGuard } from './core/services/auth/role.guard';

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
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DahsboardModule),
        canActivate: [authGuard],
        canMatch: [authGuard],

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
        path: 'importador-documentos',
        loadChildren: () => import('./documents-import/documents-import.module').then(m => m.DocumentsImportModule),
        canActivate: [authGuard],
        canMatch: [authGuard],
      },
      {
        path: 'users',
        loadChildren: () => import('./core/users/users.module').then(m => m.UsersModule),
        canActivate: [authGuard, RoleGuard],
        canMatch: [authGuard],
        data: { 
          roles: ['Admin'],
          permissions: ['VISUALIZADO_USUARIOS']
        }
      },
    ]
  },
  {path:'**', redirectTo:'/login',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
