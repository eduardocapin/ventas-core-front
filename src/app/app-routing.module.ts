import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* pages */
import { AuthComponent } from './auth/auth/auth.component';
import { PagesComponent } from './pages/pages.component';

const routes: Routes = [

  /* ruta de la pagina de inicio */
  {path:'', redirectTo:'', pathMatch:'full'},
  
  /* login */
  {path: 'login', component: AuthComponent},
  
  /* Rutas de todo el proyecto */
  {
    path: 'rechazos',  
    component: PagesComponent, 
    
    children:[
      /* ejemplo */
      /* {
        path: 'clientes',
        loadChildren: () => import('./clients/clients.module').then(m => m.ClientsModule),
        canActivate: [authGuard],
        canMatch: [authGuard]
      }, */
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
