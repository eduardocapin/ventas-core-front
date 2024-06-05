/**
    * IMPORT MODULES
*/
import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ConfigurationRoutingModule } from "./configuration-routing.module";
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
/**
    * IMPORT COMPONENTS
*/
import { ConfigurationGeneralComponent } from "./configuration-general/configuration-general.component";
import { ProfileEditPopupComponent } from './configuration-general/profile-edit-popup/profile-edit-popup.component';


@NgModule({
    declarations: [
        ConfigurationGeneralComponent,
        ProfileEditPopupComponent
    ],
    imports: [
        CommonModule,
        ConfigurationRoutingModule,
        MatIconModule,
        MatDialogModule,
        MatButtonModule,
        MatSnackBarModule
    ],
})
export class ConfigurationModule{}