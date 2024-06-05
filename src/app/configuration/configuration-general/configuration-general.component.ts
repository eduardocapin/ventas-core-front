import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfileEditPopupComponent } from './profile-edit-popup/profile-edit-popup.component';

@Component({
  selector: 'app-configuration-general',
  templateUrl: './configuration-general.component.html',
  styleUrls: ['./configuration-general.component.css']
})
export class ConfigurationGeneralComponent {

  constructor(public dialog: MatDialog) { }

  openProfileEditPopup(): void {
    const dialogRef = this.dialog.open(ProfileEditPopupComponent, {
      width: '400px',
      disableClose: true
    });
  }
}
