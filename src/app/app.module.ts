/**
  * IMPORTS MODULES
*/
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from './auth/auth.module';
import { NavbarModule } from './navbar/navbar.module';
import { MatButtonModule } from '@angular/material/button';
/**
  * IMPORTS COMPONENTS
*/
import { AppComponent } from './app.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    ConfirmDialogComponent,
    /* lo unico que se declarara sera los componentes creados en la carpeta componentes paginas no */

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NavbarModule,
    AuthModule,
    MatDialogModule,
    MatButtonModule,
    NgbModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right', // O ajusta según tus preferencias
      preventDuplicates: true,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
