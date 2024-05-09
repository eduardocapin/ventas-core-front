import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PagesModule } from './pages/pages.module';
import { HttpClientModule } from '@angular/common/http';
import { ClientsGeneralComponent } from './clients/clients-general/clients-general.component';
import { ConfigurationGeneralComponent } from './configuration/configuration-general/configuration-general.component';
import { PopupMapComponent } from './rechazos/rechazos-general/popup-map/popup-map.component';
/* components */

/* angular material api de components */
@NgModule({
  declarations: [
    AppComponent,
    ClientsGeneralComponent,
    ConfigurationGeneralComponent,
    PopupMapComponent,
    
    /* lo unico que se declarara sera los componentes creados en la carpeta componentes paginas no */

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PagesModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
