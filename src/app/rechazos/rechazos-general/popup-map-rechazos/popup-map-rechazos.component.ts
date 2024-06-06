import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IRechazo } from 'src/app/models/rechazos.model';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-popup-map',
  templateUrl: './popup-map-rechazos.component.html',
  styleUrls: ['./popup-map-rechazos.component.css']
})
export class PopupMapComponent implements OnInit, AfterViewInit {
  @ViewChild(GoogleMap) map!: GoogleMap;

  center: google.maps.LatLngLiteral = { lat: 40.4168, lng: -3.7038 }; // Coordenadas de Madrid, España
  zoom = 5; // Nivel de Zoom predefinido mapa vacío
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    scrollwheel: true,
  };
  markers: google.maps.Marker[] = [];
  infoWindow: google.maps.InfoWindow | null = null;

  constructor(
    public dialogRef: MatDialogRef<PopupMapComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedRows: IRechazo[] }
  ) {}

  ngOnInit(): void {
    if (this.data.selectedRows.length > 0) {
      this.center = {
        lat: this.data.selectedRows[0].rechazo_latitud,
        lng: this.data.selectedRows[0].rechazo_longitud
      };
    }
    console.log('Centro del mapa:', this.center); // Depuración
  }

  ngAfterViewInit(): void {
    this.addMarkers();
    this.fitBoundsToMarkers();
  }

  addMarkers() {
    this.markers = this.data.selectedRows.map(row => {
      const marker = new google.maps.Marker({
        position: { lat: row.rechazo_latitud, lng: row.rechazo_longitud },
        title: row.cliente,
        map: this.map?.googleMap,
      });

      console.log('Añadiendo marcador:', marker); // Depuración

      const rechazoColor = 'red';
      const infoContent = `
        <div>
          <h2>${row.cliente}</h2>
          <p><strong>${row.estado}</strong></p>
          <p>${row.poblacion}, ${row.provincia}</p>
          <p><strong>${row.producto}</strong></p>
          <p style="color:${rechazoColor};"><strong>${row.tipo_rechazo}</strong></p>
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
      this.markers.forEach(marker => {
        bounds.extend(marker.getPosition() as google.maps.LatLng);
      });

      console.log('Límites del mapa:', bounds); // Depuración

      if (this.markers.length === 1) {
        // Si solo hay un marcador, centra el mapa en su posición y aplica un zoom
        this.map.googleMap.setCenter(bounds.getCenter());
        this.map.googleMap.setZoom(15); //Nivel de Zoom
      } else {
        // Si hay más de un marcador, ajusta el mapa para mostrar todos los marcadores
        this.map.googleMap.fitBounds(bounds);
      }
    }
  }

  close() {
    this.dialogRef.close();
  }
}
