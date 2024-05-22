import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ElementRef, Inject } from '@angular/core';
import { Map, Marker, Popup, NavigationControl } from 'maplibre-gl';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserData } from '../rechazos-general.component';

@Component({
  selector: 'app-popup-map',
  templateUrl: './popup-map.component.html',
  styleUrls: ['./popup-map.component.css']
})
export class PopupMapComponent implements OnInit, AfterViewInit, OnDestroy {
  map: Map | undefined;
  markers: Marker[] = [];

  constructor(
    public dialogRef: MatDialogRef<PopupMapComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  ngOnInit(): void {
  }

  getLatLongFromRow(row: any): { lat: number, lng: number } {
    if (row && typeof row.latitud === 'number' && typeof row.longitud === 'number') {
      const lat = parseFloat(row.latitud);
      const lng = parseFloat(row.longitud);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
    return { lat: 0, lng: 0 };
  }

  ngAfterViewInit() {
    if (this.mapContainer && this.data && this.data.selectedRows) {
      this.map = new Map({
        container: this.mapContainer.nativeElement,
        style: 'https://api.maptiler.com/maps/cb8fbcd3-7231-4b68-8c76-59793c62034c/style.json?key=53mZ49X6yDoFGWGPGrVd',
        center: [-3.74922, 40.4637],
        zoom: 5
      });
      this.map.addControl(new NavigationControl(), 'top-right');
  
      this.data.selectedRows.forEach((row: UserData) => {
        const { estado, id, poblacion, provincia, cliente } = row;
        const { lat, lng } = this.getLatLongFromRow(row);
  
        if (this.map) {
          const markerColor = this.getMarkerColor(estado);
  
          const marker = new Marker({
            color: markerColor,
            draggable: false,
          })
          .setLngLat([lng, lat])
          .addTo(this.map);
  
          const popupContent = document.createElement('div');
          popupContent.innerHTML = `
            <div style="background-color: #FFFFFF; border: 1px solid #A4A4A4; border-radius: 10px; padding: 12px;">
              <h3 class="mb-1" style="color: #3AB284;">(${id})${cliente}</h3>
              <p>${provincia}-${poblacion}</p>
              <p>${estado}</p>
            </div>
          `;
  
          const popup = new Popup({
            closeButton: true,
            closeOnClick: false,
            focusAfterOpen: true,
            anchor: 'top',
          })
          .setDOMContent(popupContent)
          .setMaxWidth('400px');
  
          marker.setPopup(popup);
          this.markers.push(marker);
        } else {
          console.error('No se pudo crear el marcador. El mapa no está definido.');
        }
      });
    } else {
      console.error('mapElement is undefined.');
    }
  }

  getMarkerColor(estado: string): string {
    switch (estado) {
      case 'Rechazado':
        return 'red'; // Color para "Rechazado"
      case 'En Proceso':
        return 'orange'; // Color para "En Proceso"
      case 'Vendido':
        return 'green'; // Color para "Vendido"
      case 'No aplica':
        return 'gray'; // Color para "No aplica"
      default:
        return '#3AB284'; // Color por defecto
    }
  }

  ngOnDestroy() {
    this.map?.remove();
    this.markers.forEach(marker => {
      marker.remove();
    });
  }

  close() {
    this.dialogRef.close();
  }
}
