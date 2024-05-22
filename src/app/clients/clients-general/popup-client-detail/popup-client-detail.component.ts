import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserData } from '../clients-general.component';

@Component({
  selector: 'app-popup-client-detail',
  templateUrl: './popup-client-detail.component.html',
  styleUrls: ['./popup-client-detail.component.css']
})
export class PopupClientDetailComponent {

  constructor(
    public dialogRef: MatDialogRef<PopupClientDetailComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public user: UserData
  ){}
  close(){
    this.dialogRef.close();
  }
}
