// src/app/clients/clients-general/popup-map-clients/popup-map-clients.component.ts
import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GoogleMap } from '@angular/google-maps';
import { IClient } from 'src/app/models/clients.model'; // Actualizar esta línea

@Component({
  selector: 'app-popup-map-clients',
  templateUrl: './popup-map-clients.component.html',
  styleUrls: ['./popup-map-clients.component.css']
})
export class PopupMapClientsComponent implements OnInit, AfterViewInit {
  @ViewChild(GoogleMap) map!: GoogleMap;

  center: google.maps.LatLngLiteral = { lat: 41.3851, lng: 2.1734 }; // Coordenadas de Barcelona, España
  zoom = 12; // Nivel de Zoom predefinido
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    scrollwheel: true,
  };
  markers: google.maps.Marker[] = [];
  infoWindow: google.maps.InfoWindow | null = null;

  constructor(
    public dialogRef: MatDialogRef<PopupMapClientsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedRows: IClient[] } // Actualizar esta línea
  ) {}

  ngOnInit(): void {
    if (this.data.selectedRows.length > 0) {
      this.center = {
        lat: this.data.selectedRows[0].latitude, // Cambiado de latitud
        lng: this.data.selectedRows[0].longitude // Cambiado de longitud
      };
    }
  }

  ngAfterViewInit(): void {
    this.addMarkers();
    this.fitBoundsToMarkers();
  }

  addMarkers() {
    this.markers = this.data.selectedRows.map(row => {
      const marker = new google.maps.Marker({
        position: { lat: row.latitude, lng: row.longitude }, // Cambiado de latitud y longitud
        title: row.name, // Cambiado de cliente a nombre_empresa
        map: this.map?.googleMap,
      });

      const infoContent = `
        <div>
          <h2>${row.name}</h2> <!-- Cambiado de cliente a nombre_empresa -->
          <p>${row.city}, ${row.province}</p>
          <p>${row.pc}</p> <!-- Cambiado de cp a CP -->
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({
        content: infoContent
      });

      marker.addListener('click', () => {
        if (this.infoWindow) {
          this.infoWindow.close();
        }
        this.infoWindow = infoWindow;
        infoWindow.open(this.map?.googleMap, marker);
      });

      return marker;
    });
  }

  fitBoundsToMarkers() {
    if (this.map?.googleMap) {
      const bounds = new google.maps.LatLngBounds();
      this.markers.forEach(marker => bounds.extend(marker.getPosition() as google.maps.LatLng));

      if (this.markers.length === 1) {
        this.map.googleMap.setCenter(bounds.getCenter());
        this.map.googleMap.setZoom(15);
      } else {
        this.map.googleMap.fitBounds(bounds);
      }
    }
  }

  close() {
    this.dialogRef.close();
  }
}
