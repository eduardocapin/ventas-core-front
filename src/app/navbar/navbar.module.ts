import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

/* angular material */
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { RouterModule } from '@angular/router';
import {MatListModule} from '@angular/material/list';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NavbarComponent } from "./navbar.component";
import { SharedModule } from "../shared/shared.module";
import { MenuItemComponent } from "../components/menu-item/menu-item.component";
import { AppRoutingModule } from "../app-routing.module";

@NgModule({
    declarations: [
        NavbarComponent,
        MenuItemComponent
    ],
    imports: [
        CommonModule,
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        MatDividerModule,
        MatButtonModule,
        MatListModule,
        MatTooltipModule,
        RouterModule,
        MatExpansionModule,
        MatSnackBarModule,
        AppRoutingModule,
        SharedModule,
        
    ],
})
export class NavbarModule {}