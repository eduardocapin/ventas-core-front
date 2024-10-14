/**
 * IMPORT MODULES
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

/* bootstrap */
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
/**
 * IMPORT COMPONENTS
 */
import { ConfigurationGeneralComponent } from './configuration-general/configuration-general.component';
import { ProfileEditPopupComponent } from './configuration-general/profile-edit-popup/profile-edit-popup.component';
import { ReasonsRejectionsComponent } from './configuration-general/reasons-rejections/reasons-rejections.component';
import { ListItemComponent } from '../components/list-item/list-item.component';
import { ConfigurationListItemContainerComponent } from '../components/configuration-list-item-container/configuration-list-item-container.component';
import { SharedModule } from "../shared/shared.module";
import { AddCompetitorComponent } from './configuration-general/add-competitor/add-competitor.component';

@NgModule({
  declarations: [
    ConfigurationGeneralComponent,
    ProfileEditPopupComponent,
    ReasonsRejectionsComponent,
    ListItemComponent, // A futuro igual mover a shared
    ConfigurationListItemContainerComponent, AddCompetitorComponent,
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSortModule,
    MatTableModule,
    MatSlideToggleModule,
    MatListModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSelectModule,
    MatAutocompleteModule,
    SharedModule,
    NgbTooltipModule
],
})
export class ConfigurationModule {}
