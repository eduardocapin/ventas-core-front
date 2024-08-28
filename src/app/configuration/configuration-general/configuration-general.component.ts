import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfileEditPopupComponent } from './profile-edit-popup/profile-edit-popup.component';
import { ReasonsRejectionsComponent } from './reasons-rejections/reasons-rejections.component';

@Component({
  selector: 'app-configuration-general',
  templateUrl: './configuration-general.component.html',
  styleUrls: ['./configuration-general.component.css']
})
export class ConfigurationGeneralComponent {

  constructor(public dialog: MatDialog) { }

  openProfileEditPopup(): void {
    const dialogRef = this.dialog.open(ProfileEditPopupComponent, {
      width: 'auto',
      disableClose: true
    });
  }
  openReasonsRejections(): void{
    const dialogRef = this.dialog.open(ReasonsRejectionsComponent, {
      width: 'auto',
      disableClose: true
    });
  }
}
