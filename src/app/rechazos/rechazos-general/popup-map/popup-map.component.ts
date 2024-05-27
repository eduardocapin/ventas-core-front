import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-map',
  templateUrl: './popup-map.component.html',
  styleUrls: ['./popup-map.component.css']
})
export class PopupMapComponent {
  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  zoom = 4;
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    scrollwheel: false,
  };

  constructor(public dialogRef: MatDialogRef<PopupMapComponent>) {}

  close() {
    this.dialogRef.close();
  }
}
