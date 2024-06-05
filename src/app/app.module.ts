/**
  * IMPORTS MODULES
*/
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PagesModule } from './sidenav/sidenav.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from './auth/auth.module';
/**
  * IMPORTS COMPONENTS
*/
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent

    /* lo unico que se declarara sera los componentes creados en la carpeta componentes paginas no */

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PagesModule,
    HttpClientModule,
    AuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
