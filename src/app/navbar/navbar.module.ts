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

@NgModule({
    declarations: [
        NavbarComponent
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
        MatSnackBarModule
    ],
})
export class NavbarModule {}