import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserData } from '../rechazos-general.component'; // Ajusta la ruta según tu estructura de carpetas

@Component({
  selector: 'app-popup-map',
  templateUrl: './popup-map.component.html',
  styleUrls: ['./popup-map.component.css']
})
export class PopupMapComponent implements OnInit {
  center: google.maps.LatLngLiteral = { lat: 40.4168, lng: -3.7038 }; // Coordenadas de Madrid
  zoom = 5; // Nivel de Zoom
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    scrollwheel: true,
  };
  markers: google.maps.LatLngLiteral[] = [];

  constructor(
    public dialogRef: MatDialogRef<PopupMapComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedRows: UserData[] }
  ) {}

  ngOnInit(): void {
    if (this.data.selectedRows.length > 0) {
      this.center = { 
        lat: this.data.selectedRows[0].latitud, 
        lng: this.data.selectedRows[0].longitud 
      };
      this.addMarkers();
    }
  }

  addMarkers() {
    this.markers = this.data.selectedRows.map(row => ({
      lat: row.latitud,
      lng: row.longitud
    }));
  }

  close() {
    this.dialogRef.close();
  }
}